# Planit

Planning a trip is hard. At the very least, you have to figure out what to do, where to eat, and how to get around from place to place. This process usually necessitates visiting a significant number of websites, potentially including TripAdvisor, Yelp, Google Maps, and travel blogs, in order to completely flesh out a trip. Wouldn’t it be nice to visit one website with the combined capabilities of these websites to create your dream itinerary? We can help you plan-it!

Planit is a web application that allows users to create a fully fleshed-out itinerary for an upcoming trip. It also gives users the capability to save trips, collaborate on trips with other people, and browse other people’s trips that have been made publicly available.

![Team Photo](https://github.com/dartmouth-cs98/17f-plan-it/raw/master/misc/landing_page.png)

## Architecture

Frontend:
* React

Backend:
* Phoenix
* MySQL

## Setup

The frontend requires the following programs/applications to be installed:

* yarn - a dependency/package manager for Javascript
	- https://yarnpkg.com/lang/en/docs/install/#mac-tab

The backend requires the following programs/applications to be installed:

* MySQL Community Server - an open-source relational database management system
	- https://dev.mysql.com/downloads/mysql/
* Phoenix - a web development framework that implements the server-side MVC (model-view-controller) pattern
	- https://hexdocs.pm/phoenix/installation.html
* Elixir - the language that Phoenix is written is; a Phoenix dependency
	- https://elixir-lang.org/install.html
* Node.js - an open-source server framework; a Phoenix dependency
	- https://nodejs.org/en/download/
* Ruby - a programming language; a Phoenix dependency
	- https://www.ruby-lang.org/en/downloads/

## Deployment

This project currently runs on localhost, but we plan to eventually have our own webpage and host the server on Heroku.

How to deploy the frontend:
* cd to planit_client
* run `yarn start`

How to deploy the backend:
* cd to planit_server
* run `make drop`
* run `make setup`
* run `make start`

For further details, see the READMEs in /planit\_client and /planit\_server.

## Authors

Jeffrey Gao, Helen He, Samuel Lee, Emily Lin, Robert Sayegh, Jiyun Sung  
CS 98 17F/18W

## Acknowledgments