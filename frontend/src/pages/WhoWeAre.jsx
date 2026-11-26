import React from 'react'
import { Link } from 'react-router-dom'
import './WhoWeAre.css'

const WhoWeAre = () => {
  return (
    <main className="about-page">

      {/* About Hero */}
      <section className="about-hero" id="about">
        <div className="about-hero-content">
          <span className="about-label">WHO WE ARE</span>

          <h1>About SOCCODO</h1>

          <p>
            Working with communities to encourage social development,
            strengthen local participation, and support a better future
            for everyone.
          </p>

          <Link to="/#what-we-do" className="about-button">
            Explore Our Website
          </Link>
        </div>
      </section>

      {/* Introduction */}
      <section className="about-introduction" id="introduction">
        <div className="about-container about-intro-grid">
          <div className="about-intro-heading">
            <span className="about-label">GET TO KNOW US</span>
            <h2>Building stronger communities together</h2>
          </div>

          <div className="about-intro-text">
            <p>
              SOCCODO stands for Social, Climate and Community Development
              Organization. We focus on community development and social
              well-being, with attention to the needs and participation
              of local communities.
            </p>

            <p>
              Our areas of interest include education, environmental
              protection, women's and youth empowerment, water and
              sanitation, and support for vulnerable people.
            </p>

            <p>
              We believe that lasting development grows when communities
              participate, share ideas, and work together toward common goals.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision and Values */}
      <section className="about-purpose" id="purpose">
        <div className="about-container">
          <div className="about-section-heading">
            <span className="about-label">OUR PURPOSE</span>
            <h2>What guides our work</h2>
            <p>
              Our work is guided by the goal of supporting inclusive,
              sustainable, and community-led development.
            </p>
          </div>

          <div className="about-purpose-grid">

            <article
              className="about-purpose-card"
              id="mission"
            >
              <div className="about-card-icon">01</div>
              <h3>Our Mission</h3>
              <p>
                To bring hope to the society where the women youth, elderly and Children 
                can live without violence abuse, diseases, poverty, corruption and other 
                problems facing them.
              </p>
            </article>

            <article
              className="about-purpose-card"
              id="vision"
            >
              <div className="about-card-icon">02</div>
              <h3>Our Vision</h3>
              <p>
                To have rural communities transformed into the best communities by helping them to obtain the required information, knowledge, social services, education and fight poverty as
              </p>
            </article>

            <article
              className="about-purpose-card"
              id="values"
            >
              <div className="about-card-icon">03</div>
              <h3>Our Values</h3>
              <p>
                We aim to promote inclusion, accountability, integrity,
                collaboration, respect, and responsible environmental
                stewardship in our work.
              </p>
            </article>

          </div>

        </div>
      </section>

      {/* Commitment */}
      <section className="about-commitment" id="commitment">
        <div className="about-container about-commitment-grid">
          <div>
            <span className="about-label">OUR COMMITMENT</span>
            <h2>Development that includes everyone</h2>
          </div>

          <div>
            <p>
              We recognize that communities have different needs and
              strengths. Our approach emphasizes listening, collaboration,
              and identifying practical ways to support positive change.
            </p>

            <p>
              We are particularly interested in initiatives that benefit
              children, young people, women, older people, and other
              vulnerable members of society.
            </p>

            <Link to="/what-we-do" className="about-text-link">
              Discover our focus areas →
            </Link>
          </div>
        </div>
      </section>

      
      {/* Team */}
      <section className="about-team" id="team">
        <div className="about-container">
          <div className="about-section-heading">
            <span className="about-label">OUR TEAM</span>
            <h2>Meet the People Behind SOCCODO</h2>
            <p>
              Our team works together to support community development,
              empower people, and create positive and sustainable change.
            </p>
          </div>

          <div className="about-team-grid">
            <article className="about-team-card">
              <div className="about-team-image">
                <img
                  src="https://placehold.co/600x700/e4f3e9/174c39?text=Executive+Director"
                  alt="Executive Director"
                  loading="lazy"
                />
              </div>
              <div className="about-team-info">
                <h3>Full Name</h3>
                <p>Executive Director</p>
              </div>
            </article>

            <article className="about-team-card">
              <div className="about-team-image">
                <img
                  src="https://placehold.co/600x700/e4f3e9/174c39?text=Program+Coordinator"
                  alt="Program Coordinator"
                  loading="lazy"
                />
              </div>
              <div className="about-team-info">
                <h3>Full Name</h3>
                <p>Program Coordinator</p>
              </div>
            </article>

            <article className="about-team-card">
              <div className="about-team-image">
                <img
                  src="https://placehold.co/600x700/e4f3e9/174c39?text=Finance+Officer"
                  alt="Finance and Administration Officer"
                  loading="lazy"
                />
              </div>
              <div className="about-team-info">
                <h3>Full Name</h3>
                <p>Finance and Administration Officer</p>
              </div>
            </article>

            <article className="about-team-card">
              <div className="about-team-image">
                <img
                  src="https://placehold.co/600x700/e4f3e9/174c39?text=Community+Officer"
                  alt="Community Development Officer"
                  loading="lazy"
                />
              </div>
              <div className="about-team-info">
                <h3>Full Name</h3>
                <p>Community Development Officer</p>
              </div>
            </article>
          </div>
        </div>
      </section>


      {/* Call to Action */}
      <section className="about-cta" id="contact">
        <div className="about-container">
          <h2>Let's work together for stronger communities</h2>
          <p>
            Learn more about our work or get in touch to explore ways
            to collaborate with SOCCODO.
          </p>

          <Link
            to="/contact"
            className="about-button about-button-light"
          >
            Contact Us
          </Link>
        </div>
      </section>

    </main>
  )
}

export default WhoWeAre