# Table of Contents

* [Record of working hours for the Full Stack Open project](#record-of-working-hours-for-the-full-stack-open-project)
* [Introduction](#introduction)
* [Deployment](#deployment)
* [How to use](#how-to-use)

# Record of working hours for the Full Stack Open project

Project's record of working hours is in the file workinghours.md.
This file includes combined hours spent developing both front- and backend.

Frontend was previously developed in this [repository](https://github.com/jj-stigell/srs-app-frontend).
Hours have been transferred from there to this repository.

# Introduction

Welcome to Yomiko - your trusted companion for mastering the intricate beauty of the Japanese language.
Harnessing the power of a Spaced Repetition System (SRS), Yomiko is not just another learning app,
but your personalized guide to fully immerse in the exquisite world of Kanji, Kana, and beyond.

No matter if you're an absolute beginner or an advanced learner striving for perfection, Yomiko
is designed to cater to everyone. Choose your own pace of learning by selecting your proficiency
level based on the globally recognized Japanese-Language Proficiency Test (JLPT), and then
diving into the meticulously curated categories and card decks. 

Every step in Yomiko is designed to facilitate a more profound understanding and recall of Japanese
characters and words, streamlining your language acquisition process. Each card deck presents
a specific set of characters or words, engaging you in an interactive, dynamic learning process.

As the Japanese proverb says - 継続は力なり, "Persistence is power." Yomiko embodies this spirit by
encouraging you to consistently revisit and revise your learning, ensuring a stronger grasp and
retention of the language.

Embark on your journey to master Japanese with Yomiko - where tradition meets technology to transform
your language learning experience. Whether your goal is to read Manga without translations,
watch Anime without subtitles, engage in captivating conversations with native speakers, or
simply gain a deeper understanding of this unique culture - Yomiko is here to guide you
every step of the way.

Experience the joy of learning Japanese with Yomiko today. Your path to fluency starts here.

# Deployment

Frontend is deployed to https://app.yomiko.io

Backend is deployed to https://yomiko-backend.onrender.com

# How to use

App has demo user:
```
username: demo@demo.com
password: Testing123
```

Workflow:

1. First, you can create your own account. You'll need to verify it using a link sent to your email.
2. Once verified, log in to see your main dashboard.
3. Right now, the dashboard shows dummy statistics. 
4. When you're ready to study, choose a subject category.
5. Depending on the language you chose, you'll get study materials in that language.
(Just remember, while the app itself can be in Vietnamese, we don't have study materials in Vietnamese yet).
6. You can also manage your account from the settings page, including checking your information, changing your password, or logging out.
7. As of now, we only have materials for the N5 level of the Japanese Language Proficiency Test (JLPT) - translating everything else is taking us a bit longer.
8. Unfortunately, our Spaced Repetition System (SRS) for studying isn't up and running yet due to time constraints.
9. If you encounter any glitches while using the app, please let us know through the 'send bug report' option in the study view.


TODO:

General
- [ ] update all packages
- [ ] Share types between front and back
- [ ] E2E testing
- [ ] 

Frontend
- [ ] Details page for each car
- [ ] JLPT practice cards
- [ ] Admin panel
- [ ] Centralize theme colors
- [ ] Admin preview card
- [ ] Admin list decks
- [ ] Admin list cards
- [ ] Admin edit card
- [ ] Admin list bugs
- [ ] Admin update bugs
- [ ] Rearrange directories
- [ ] component testing
- [ ] API refactor
- [ ] Errors to its own handler
- [ ] Sticky footer
- [ ] sign in with google, facebook

Backend
- [ ] Admin all decks
- [ ] Admin all cards
- [ ] Admin edit card
- [ ] Admin get card all data
- [ ] Store data to AWS S3
- [ ] Fetch data from S3
- [ ] OpenAI integration
- [ ] 