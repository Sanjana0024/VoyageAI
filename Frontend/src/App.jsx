
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { generateTrip } from "./services/api";
import { streamTrip } from "./services/stream";

import TravelCard from "./components/TravelCard";
import HistorySidebar from "./components/HistorySidebar";
import AgentChat from "./components/AgentChat";
import MapView from "./components/MapView";
import Login from "./components/Login";
import "./App.css";

const destinations = [
  {
    name: "Bali, Indonesia",
    meta: "Island escapes",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Swiss Alps",
    meta: "Mountain retreats",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Santorini, Greece",
    meta: "Coastal charm",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Kyoto, Japan",
    meta: "Culture & calm",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Goa, India",
    meta: "Sun, sand & sea",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=700&q=85",
  },
];

function App() {
    const shouldReduceMotion = useReducedMotion();

  const cinematicReveal = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 28,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const [page, setPage] = useState("home");

  const [input, setInput] = useState("");
  const [destination, setDestination] = useState("");
  const [tripType, setTripType] = useState("Adventure");
  const [duration, setDuration] = useState("5 days");
  const [budget, setBudget] = useState("₹30,000");

  const [trip, setTrip] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const deleteMessage = (index) => {
    setMessages((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  // Keep the homepage public and restore an existing Firebase session.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  // Load locally saved trip history.
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("voyage_history") || "[]"
      );

      setHistory(Array.isArray(saved) ? saved : []);
    } catch {
      setHistory([]);
    }
  }, []);

  // Load saved agent messages for a signed-in user.
  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function loadMessages() {
      try {
        const snapshot = await getDoc(
          doc(db, "chats", user.uid)
        );

        if (
          !cancelled &&
          snapshot.exists() &&
          Array.isArray(snapshot.data().messages)
        ) {
          setMessages(snapshot.data().messages);
        }
      } catch (err) {
        console.error("Could not load saved chat:", err);
      }
    }

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Save chat messages for signed-in users.
  useEffect(() => {
    if (!user || messages.length === 0) return;

    setDoc(doc(db, "chats", user.uid), {
      messages,
      updatedAt: new Date(),
    }).catch((err) => {
      console.error("Could not save chat:", err);
    });
  }, [messages, user]);

  const openPlanner = (prefill = "") => {
    setInput(prefill);
    setPage("planner");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const request = [
      destination ? `Destination: ${destination}` : "",
      `Trip type: ${tripType}`,
      `Duration: ${duration}`,
      `Budget: ${budget}`,
      "Create a practical itinerary with estimated costs, activities, places to visit and travel tips.",
    ]
      .filter(Boolean)
      .join(". ");

    openPlanner(request);
  };

  const handlePlanTrip = async (event) => {
    event?.preventDefault();

    if (!input.trim() || loading) return;

    const userInput = input.trim();

    setLoading(true);
    setError("");
    setMessages([]);
    setTrip(null);

    // Start the agent stream separately so a stream error
    // does not prevent the main itinerary request.
    streamTrip(userInput, (message) => {
      setMessages((previous) => [...previous, message]);
    }).catch((err) => {
      console.error("Agent stream failed:", err);

      setMessages((previous) => [
        ...previous,
        "VoyageAI: Live agent updates are temporarily unavailable. The itinerary request is still running.",
      ]);
    });

    try {
      const response = await generateTrip({
        user_input: userInput,
      });

      const tripData = response?.data?.data;

      if (!tripData) {
        throw new Error(
          "The server returned an empty itinerary. Please try again."
        );
      }

      setTrip(tripData);

      const newTrip = {
        id: Date.now(),
        title: tripData.trip_summary || userInput.slice(0, 60),
        date: new Date().toLocaleDateString(),
        trip: tripData,
      };

      setHistory((previous) => {
        const updated = [newTrip, ...previous].slice(0, 50);

        localStorage.setItem(
          "voyage_history",
          JSON.stringify(updated)
        );

        return updated;
      });
    } catch (err) {
      console.error("Trip planning failed:", err);

      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Couldn't plan this trip. Check that the backend is running and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const openHistoryTrip = (selectedTrip) => {
    setTrip(selectedTrip.trip);
    setInput(selectedTrip.title || "");
    setMessages([]);
    setPage("planner");
    setError("");
  };

  const createNewTrip = () => {
    setTrip(null);
    setInput("");
    setMessages([]);
    setError("");
    setPage("planner");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAuthMode(null);
      setPage("home");
      setTrip(null);
      setMessages([]);
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Could not sign out. Please try again.");
    }
  };

  if (!authReady) {
    return (
      <div className="voyage-loading-screen">
        <span className="voyage-spinner" />
        Preparing your journey…
      </div>
    );
  }

  // Authentication appears only when the user chooses it.
  if (authMode) {
    return (
      <Login
        mode={authMode}
        setMode={setAuthMode}
        onClose={() => setAuthMode(null)}
        setUser={setUser}
      />
    );
  }

  // Existing AI trip planner.
  if (page === "planner") {
    return (
      <div className="voyage-planner-shell">
        <header className="planner-topbar">
          <button
            className="voyage-logo"
            onClick={() => setPage("home")}
          >
            ✦ VoyageAI
          </button>

          <div className="planner-topbar-actions">
            <button
              className="planner-home-link"
              onClick={() => setPage("home")}
            >
              Back to home
            </button>

            {user ? (
              <>
                <span className="planner-user">
                  {user.displayName || user.email || "Traveler"}
                </span>

                <button
                  className="voyage-btn voyage-btn-outline"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </>
            ) : (
              <button
                className="voyage-btn voyage-btn-blue"
                onClick={() => setAuthMode("login")}
              >
                Sign in to save trips
              </button>
            )}
          </div>
        </header>

        <div className="voyage-planner-layout">
          <HistorySidebar
            history={history}
            onSelect={openHistoryTrip}
            onNewTrip={createNewTrip}
          />

          <main className="voyage-planner-main">
            <div className="planner-heading">
              <p className="voyage-eyebrow">
                YOUR PERSONAL AI TRAVEL ASSISTANT
              </p>

              <h1>
                Let’s plan your next{" "}
                <span>great escape.</span>
              </h1>

              <p>
                Tell VoyageAI what you have in mind. Your itinerary,
                budget and travel ideas start here.
              </p>
            </div>

            <form
              className="planner-input-card"
              onSubmit={handlePlanTrip}
            >
              <label htmlFor="trip-prompt">
                Where would you like to go?
              </label>

              <textarea
                id="trip-prompt"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Example: Plan a 5 day adventure trip to Manali under ₹30,000"
                rows={4}
              />

              {error && (
                <p className="voyage-error" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="voyage-btn voyage-btn-orange planner-submit"
              >
                {loading
                  ? "✦ Building your itinerary…"
                  : "Plan my trip →"}
              </button>
            </form>

            {(loading || messages.length > 0) && (
              <AgentChat
                messages={messages}
                onDeleteMessage={deleteMessage}
              />
            )}

            <TravelCard data={trip} loading={loading} />

            <section className="planner-map-section">
              <h2>Explore the map</h2>
              <p>
                Use your itinerary to discover places along your journey.
              </p>
              <MapView />
            </section>
          </main>
        </div>
      </div>
    );
  }

  // Public premium landing page.
  return (
    <div className="voyage-page">
      <header className="voyage-nav">
        <button
          className="voyage-logo"
          onClick={() => setPage("home")}
        >
          ✦ VoyageAI
        </button>

        <nav className="voyage-nav-links" aria-label="Main navigation">
          <a className="active" href="#home">Home</a>
          <a href="#destinations">Destinations</a>
          <a href="#services">Tours</a>
          <a href="#services">Hotels</a>
          <a href="#services">Flights</a>
          <a href="#inspiration">Inspiration</a>
        </nav>

        <div className="voyage-nav-actions">
          {user ? (
            <>
              <span className="voyage-user-chip">
                {user.displayName || user.email || "Traveler"}
              </span>

              <button
                className="voyage-btn voyage-btn-outline"
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                className="voyage-signin"
                onClick={() => setAuthMode("login")}
              >
                Sign in
              </button>

              <button
                className="voyage-register"
                onClick={() => setAuthMode("register")}
              >
                Register
              </button>
            </>
          )}

          <button
            className="voyage-btn voyage-btn-orange nav-explore"
            onClick={() => openPlanner()}
          >
            Explore tours ↗
          </button>
        </div>
      </header>

      <main id="home">
        <motion.section
  className="voyage-hero"
  initial={shouldReduceMotion ? false : { opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: shouldReduceMotion ? 0.01 : 1.1 }}
>
          
<motion.div
  className="voyage-hero-content"
  initial="hidden"
  animate="visible"
  variants={{
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.22,
        delayChildren: shouldReduceMotion ? 0 : 0.15,
      },
    },
  }}
>

            <span className="voyage-hero-kicker">
              <span />
              MADE FOR THE WAY YOU WANDER
            </span>

            
<motion.h1 variants={{
  hidden: {
    opacity: shouldReduceMotion ? 1 : 0,
    y: shouldReduceMotion ? 0 : 55,
    filter: shouldReduceMotion ? "none" : "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: shouldReduceMotion ? 0.01 : 0.85,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}}>
  Discover places.
  <br />
  <em>Collect moments.</em>
</motion.h1>


<motion.p
  variants={cinematicReveal}
>
  Extraordinary journeys begin with a little inspiration.
  Let AI help you plan a trip that feels entirely yours.
</motion.p>


            <button
              className="voyage-btn voyage-btn-orange hero-cta"
              onClick={() => openPlanner()}
            >
              Plan your journey <span>↗</span>
            </button>

            <div className="voyage-hero-note">
              <span className="voyage-note-avatars">✦ ◉ ✿</span>
              Thoughtful trips, made around you
            </div>
          </motion.div>

          <div className="voyage-hero-caption">
            <span>01 / 05</span>
            <span className="caption-line" />
            <span>Find your somewhere</span>
          </div>
        </motion.section>

        <section className="voyage-search-wrap" aria-label="Plan a trip">
          <form className="voyage-search" onSubmit={handleSearch}>
            <div className="voyage-search-field">
              <label htmlFor="destination">Destination</label>
              <input
                id="destination"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                placeholder="Where to?"
              />
            </div>

            <div className="voyage-search-field">
              <label htmlFor="trip-type">Travel style</label>
              <select
                id="trip-type"
                value={tripType}
                onChange={(event) => setTripType(event.target.value)}
              >
                <option>Adventure</option>
                <option>Relaxation</option>
                <option>Culture</option>
                <option>Family</option>
                <option>Romantic</option>
                <option>Food & local life</option>
              </select>
            </div>

            <div className="voyage-search-field">
              <label htmlFor="duration">Duration</label>
              <select
                id="duration"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
              >
                <option>Weekend</option>
                <option>3 days</option>
                <option>5 days</option>
                <option>7 days</option>
                <option>10 days</option>
                <option>2 weeks</option>
              </select>
            </div>

            <div className="voyage-search-field">
              <label htmlFor="budget">Budget per trip</label>
              <select
                id="budget"
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
              >
                <option>₹10,000</option>
                <option>₹20,000</option>
                <option>₹30,000</option>
                <option>₹50,000</option>
                <option>₹1,00,000+</option>
                <option>Flexible</option>
              </select>
            </div>

            <button
              className="voyage-btn voyage-btn-orange voyage-search-button"
              type="submit"
            >
              <span>⌕</span> Search trips
            </button>
          </form>
        </section>

        <section className="voyage-trust">
          <div>
            <span className="trust-icon">✦</span>
            <span>
              <strong>Made for you</strong>
              <small>Personalized AI itineraries</small>
            </span>
          </div>

          <div>
            <span className="trust-icon">◎</span>
            <span>
              <strong>Travel with clarity</strong>
              <small>Budgets, plans and practical tips</small>
            </span>
          </div>

          <div>
            <span className="trust-icon">♡</span>
            <span>
              <strong>Your trip, your pace</strong>
              <small>Ideas for every kind of traveler</small>
            </span>
          </div>

          <div className="trust-rating">
            <strong>★★★★★</strong>
            <small>Made for curious travelers</small>
          </div>
        </section>

        <section className="voyage-section voyage-container" id="destinations">
          <div className="voyage-section-heading">
            <div>
              <p className="voyage-eyebrow">A LITTLE INSPIRATION</p>
              <h2>
                Places worth dreaming about<span>.</span>
              </h2>
              <p className="section-subtitle">
                A few beautiful places to get your next adventure started.
              </p>
            </div>

            <button
              className="voyage-text-link"
              onClick={() => openPlanner()}
            >
              Explore all destinations <span>↗</span>
            </button>
          </div>

          <motion.div
  className="voyage-destinations"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.15 }}
  variants={{
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.14,
      },
    },
  }}
>
            {destinations.map((place) => (
              
<motion.button
  className="voyage-destination"
  key={place.name}
  variants={{
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.65,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }}
  whileHover={shouldReduceMotion ? undefined : { y: -7, scale: 1.02 }}
  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
  onClick={() =>
    openPlanner(
      `Plan a ${duration} ${tripType.toLowerCase()} trip to ${place.name} with a budget of ${budget}. Include itinerary, estimated costs, local experiences and travel tips.`
    )
  }
>
  <img src={place.image} alt={place.name} loading="lazy" />

  <span className="destination-heart" aria-hidden="true">
    ↗
  </span>

  <span className="voyage-destination-info">
    <small>{place.meta}</small>
    <strong>{place.name}</strong>
    <span>★ {place.rating} <i>·</i> Explore destination</span>
  </span>
</motion.button>

            ))}
          </motion.div>
        </section>

        <section className="voyage-services" id="services">
          <div className="voyage-container">
            <p className="voyage-eyebrow">THE JOURNEY, SIMPLIFIED</p>

            <h2>
              Everything you need to go <em>further.</em>
            </h2>

            <p className="services-intro">
              From the first spark of inspiration to a day-by-day plan,
              make the whole journey feel easier.
            </p>

            <div className="voyage-services-grid">
              <article className="voyage-service-card">
                <span className="service-icon">✳</span>
                <h3>AI-crafted itineraries</h3>
                <p>
                  Turn a destination, a few interests and a budget into a
                  thoughtful travel plan.
                </p>
                <button onClick={() => openPlanner()}>
                  Build an itinerary ↗
                </button>
              </article>

              <article className="voyage-service-card">
                <span className="service-icon">⌁</span>
                <h3>Budget-aware planning</h3>
                <p>
                  Get cost estimates and practical suggestions that fit
                  the kind of trip you want.
                </p>
                <button
                  onClick={() =>
                    openPlanner(
                      "Help me plan a memorable trip with a clear budget breakdown and money-saving tips."
                    )
                  }
                >
                  Plan my budget ↗
                </button>
              </article>

              <article className="voyage-service-card">
                <span className="service-icon">⌖</span>
                <h3>Places on the map</h3>
                <p>
                  Explore destinations and discover points of interest
                  as your itinerary takes shape.
                </p>
                <button
                  onClick={() =>
                    openPlanner(
                      "Suggest destinations and must-see places, then create a mapped travel itinerary."
                    )
                  }
                >
                  Explore places ↗
                </button>
              </article>
            </div>
          </div>
        </section>

        <section className="voyage-inspiration" id="inspiration">
          <div>
            <p className="voyage-eyebrow">YOUR NEXT CHAPTER</p>
            <h2>
              The world is waiting.
              <br />
              <em>Where will you begin?</em>
            </h2>
          </div>

          <button
            className="voyage-btn voyage-btn-orange"
            onClick={() => openPlanner()}
          >
            Start planning with AI ↗
          </button>
        </section>
      </main>

      <footer className="voyage-footer">
        <button
          className="voyage-logo"
          onClick={() => setPage("home")}
        >
          ✦ VoyageAI
        </button>

        <span>Travel thoughtfully. Remember everything.</span>
        <span>© {new Date().getFullYear()} VoyageAI</span>
      </footer>
    </div>
  );
}

export default App;
