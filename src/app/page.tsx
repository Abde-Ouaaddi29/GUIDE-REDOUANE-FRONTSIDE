"use client"
import React from 'react';
import About from '@/components/home/about/about';
import DisplayFeedback from '@/components/home/feedback/DisplayFeedback';
import ExperienceHead from '@/components/home/experiences/experienceHead';
import SemiServices from '@/components/home/semi-services/semi-services';
import ExperienceBody from '@/components/home/experiences/experienceBody';
import SemiValues from '@/components/home/semi-values/semi-values';
import SemiContact from '@/components/home/semi-contact/semi-contact';

const HomePage = () => {
  return (
    <div className="">
      <About />
      <ExperienceHead />
      <SemiServices/>
      <SemiValues />
      <SemiContact />
      <DisplayFeedback />
      <ExperienceBody />
      
    </div>
  );
};

export default HomePage;