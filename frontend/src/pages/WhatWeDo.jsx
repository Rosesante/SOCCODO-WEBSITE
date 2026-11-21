import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import './WhatWeDo.css';
import ardhiImage2 from '../assets/Ardhi2.jpg';
import ardhiImage3 from '../assets/Ardhi3.jpg';
import ardhiImage4 from '../assets/Ardhi4.jpg';
import ardhiImage7 from '../assets/Ardhi7.jpg';
import ardhiImage6 from '../assets/Ardhi6.jpg';
import ardhiImage13 from '../assets/Ardhi13.jpeg';


const focusAreas = [
  {
    id: 'community',
    title: 'Community Development',
    category: 'COMMUNITY DEVELOPMENT',
    description:
      'Addressing community challenges through participation, local initiatives, awareness and collaboration to improve living conditions and promote sustainable development.',
    image: ardhiImage4,
    imageAlt:
      'Community members coming together during a group engagement activity.',
  },
  {
    id: 'education',
    title: 'Education and Youth',
    category: 'EDUCATION & YOUTH',
    description:
      'Promoting access to education, youth participation, skills development, innovation and opportunities that empower young people to contribute to society.',
    image: ardhiImage3, 
    imageAlt: 'Students participating in a classroom learning activity.',
  },
  {
    id: 'women',
    title: 'Women and Social Welfare',
    category: 'WOMEN & SOCIAL WELFARE',
    description:
      'Promoting women’s empowerment, social inclusion, equal opportunities and improved welfare for vulnerable individuals and households.',
    image: ardhiImage4,
    imageAlt:
      'A woman participating in a professional and community development setting.',
  },
  {
    id: 'environment',
    title: 'Climate and Environment',
    category: 'CLIMATE & ENVIRONMENT',
    description:
      'Addressing environmental challenges through conservation, climate awareness, environmental protection and sustainable use of natural resources.',
    image: ardhiImage7, 
    imageAlt:
      'A natural landscape illustrating the importance of environmental conservation.',
  },
  {
    id: 'water',
    title: 'Water and Sanitation',
    category: 'WATER & SANITATION',
    description:
      'Promoting access to safe water, proper sanitation, hygiene awareness and protection of water resources for healthier communities.',
    image: ardhiImage13,
    imageAlt: 'Clean water flowing from a water source.',
  },
  {
    id: 'disaster',
    title: 'Disaster Relief',
    category: 'DISASTER RELIEF',
    description:
      'Supporting vulnerable communities through disaster preparedness, emergency awareness, relief assistance and community recovery initiatives.',
    image: ardhiImage6,
    imageAlt:
      'Volunteers working together to support people in need.',
  },
];

const WhatWeDo = () => {
  return (
    <main className="what-we-do-page">
      {/* Hero */}
      <section className="what-we-do-hero">
        <div className="what-we-do-hero-overlay">
          <div className="what-we-do-container">
            <span className="what-we-do-eyebrow">OUR WORK, OUR COMMITMENT</span>
            <h1>What We Do</h1>
            <p>
              We work alongside communities and partners to address social,
              environmental and development challenges and help create lasting,
              positive change.
            </p>
            <a className="what-we-do-hero-button" href="#focus-areas">
              Explore Our Focus Areas <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="what-we-do-intro">
        <div className="what-we-do-container what-we-do-intro-grid">
          <div>
            <span className="what-we-do-eyebrow">WHAT GUIDES OUR WORK</span>
            <h2>Addressing Community Challenges, Creating Lasting Change</h2>
          </div>
          <p>
            SOCCODO works with communities to identify challenges and promote
            practical, inclusive and sustainable responses. Our work focuses on
            improving people's quality of life, expanding opportunities and
            strengthening the ability of communities to participate in their
            own development.
          </p>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="what-we-do-focus" id="focus-areas">
        <div className="what-we-do-container">
          <div className="what-we-do-section-heading">
            <span className="what-we-do-eyebrow">HOW WE CONTRIBUTE</span>
            <h2>Our Focus Areas</h2>
            <p>
              We work towards addressing key social, environmental and
              community challenges through initiatives that promote
              sustainable development and improve people's lives.
            </p>
          </div>

          <div className="what-we-do-grid">
            {focusAreas.map((area, index) => (
              <article
                className="what-we-do-card"
                id={`activity-${area.id}`}
                key={area.id}
              >
                <div className="what-we-do-image-wrapper">
                  <img
                    src={area.image}
                    alt={area.imageAlt}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                      event.currentTarget.nextElementSibling?.classList.add(
                        'is-visible'
                      );
                    }}
                  />
                  <div
                    className="what-we-do-image-placeholder"
                    aria-hidden="true"
                  >
                    SOCCODO
                  </div>
                  <span className="what-we-do-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="what-we-do-card-content">
                  <span className="what-we-do-category">{area.category}</span>
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                  <span className="what-we-do-card-bottom">
                    Community-focused development
                    <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Our approach */}
      <section className="what-we-do-approach">
        <div className="what-we-do-container what-we-do-approach-grid">
          <div className="what-we-do-approach-content">
            <span className="what-we-do-eyebrow">OUR APPROACH</span>
            <h2>Working With Communities for Sustainable Change</h2>
            <p>
              We believe meaningful development happens when communities are
              involved in identifying their needs, shaping solutions and taking
              part in the activities that affect their lives. We value
              collaboration, inclusion and learning.
            </p>
          </div>

          <div className="what-we-do-principles">
            <div>
              <span>01</span>
              <p>
                <strong>Community Engagement</strong>
                <small>
                  Listening to communities and encouraging participation in
                  identifying local needs and priorities.
                </small>
              </p>
            </div>
            <div>
              <span>02</span>
              <p>
                <strong>Awareness and Education</strong>
                <small>
                  Sharing information and promoting knowledge that supports
                  positive social and environmental practices.
                </small>
              </p>
            </div>
            <div>
              <span>03</span>
              <p>
                <strong>Partnership and Collaboration</strong>
                <small>
                  Working with relevant institutions, organizations and
                  stakeholders to strengthen community initiatives.
                </small>
              </p>
            </div>
            <div>
              <span>04</span>
              <p>
                <strong>Learning and Improvement</strong>
                <small>
                  Learning from activities and community feedback to improve
                  future initiatives.
                </small>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="what-we-do-cta">
        <div className="what-we-do-container">
          <span className="what-we-do-eyebrow">BE PART OF THE CHANGE</span>
          <h2>Building Better Communities Together</h2>
          <p>
            Sustainable change is strengthened when people and organizations
            work together. Connect with SOCCODO to learn more about our work
            and opportunities for collaboration.
          </p>
          <div className="what-we-do-cta-actions">
            <Link to="/contact" className="what-we-do-cta-primary">
              Contact Us
            </Link>
            <Link to="/success-stories" className="what-we-do-cta-secondary">
              Explore Our Success Stories
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default WhatWeDo;

