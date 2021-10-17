import React from 'react';
import Particle from 'react-tsparticles'
import { optionsParticles } from '../utility';
function HomePage() {


  //SECURITY CONCERN #1 = ONLY SEND THE INFO NEEDED FOR RELEVANT DISPLAY IE DO NOT SEND EVERYTHING TO DASHBOARD
  //GENERATE TEST USERS

  return (
    <div className="App">
      <div className="tsparticles">
        <Particle
          height="100vh"
          width="100vw"
          options={optionsParticles}
        />
      </div>
      <header className="header">
        <img src="/brain.png" alt="logo" />
        <h1 className="fade-in">JMSA Tutoring Services</h1>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
        </a>
      </header>

      <section className="home-blurb">
        <h2>About Us</h2>
        <p>
          Welcome JMSA students. Having trouble in classes? Need some help? There's no one better to reach out to than someone who's already gone through it all. Use the JMSA tutoring site as a one-stop shop to set up dates, times, organize community service hours, and find tutees and tutors.
        </p>

        <h2>FAQ</h2>
        <p>
          <div>
            <p>Q: Can I delete my account?</p>
            <p>A: Yes, please head to profile, then edit user. You will be able to delete your account there.</p>
          </div>
          <div>
            <p>Q: Help! Something broke!</p>
            <p>A: This site is in active beta, please email me at sotoemily03@gmail.com so that I can get on fixing it ASAP.</p>
          </div>
          <div>
            <p>Q: What if omeone's behaving inappropriately? </p>
            <p>A: Please give us their username/email or name and we'll swiftly take care of the issue.</p>
          </div>
          <div>
            <p>Q: What do you do with my data?</p>
            <p>A: The purpose of all data collected is only to connect you with other students. We will NOT use this data in any other way, unless we need to get in contact with you.</p>
          </div>
          <div>
            <p>Q: I saw something I'm not supposed to see...</p>
            <p>A: I'll buy you a cookie if you tell me about any security vulnerabilities.</p>
          </div>
          <div>
            <p>Q: Will this work on my phone?</p>
            <p>A: This *should* work just fine on your phone. If you experience any glitches, again, please get in touch.</p>
          </div>
        </p>
      </section>

    </div>
  );
}



export default HomePage;
