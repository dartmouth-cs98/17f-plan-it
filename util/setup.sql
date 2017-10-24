/* Planit
   Jeff Gao, Helen He, Sam Lee, Emily Lin, Rob Sayegh, Jiyun Sung | 17F/18W
   setup.sql */
   
USE plan_it_dev;

/* Planit
   Jeff Gao, Helen He, Sam Lee, Emily Lin, Rob Sayegh, Jiyun Sung | 17F/18W
   setup.sql */
   
USE plan_it_dev;

DROP TABLE IF EXISTS person;
DROP TABLE IF EXISTS edit_permission;
DROP TABLE IF EXISTS trip;
DROP TABLE IF EXISTS card;
DROP TABLE IF EXISTS travel;
DROP TABLE IF EXISTS trip_comment;

CREATE TABLE person (
	person_id			INT			AUTO_INCREMENT,
    person_fname		VARCHAR(50)	NOT NULL,
    person_lname		VARCHAR(50) NOT NULL,
    person_email		VARCHAR(50) NOT NULL, 
    person_username		VARCHAR(50)	NOT NULL,
    person_birthday		DATETIME	NOT NULL,
    PRIMARY KEY (person_id)
    );
    
CREATE TABLE trip (
	trip_id			INT				AUTO_INCREMENT,
    trip_name		VARCHAR(50)		NOT NULL,
    trip_intensity	VARCHAR(50)		NOT NULL,
    trip_visibility	BOOLEAN 		NOT NULL,
    trip_upvotes	INT				NOT NULL,
    PRIMARY KEY (trip_id),
    FOREIGN KEY (person_id) 	 REFERENCES person(person_id)
    );
    
CREATE TABLE card (
	card_id			INT			 AUTO_INCREMENT,
    card_type		VARCHAR(50)	 NOT NULL,
    card_name		VARCHAR(50)	 NOT NULL,
    card_city		VARCHAR(255) NOT NULL,
	card_country	VARCHAR(255) NOT NULL,
    card_address	VARCHAR(255) NOT NULL,
	card_start_time	DATETIME	 NOT NULL,
    card_end_time	DATETIME	 NOT NULL,
	card_day_number INT			 NOT NULL,
    PRIMARY KEY	(card_id),
	FOREIGN KEY (trip_id) 	REFERENCES trip(trip_id),
	FOREIGN KEY (travel_id) REFERENCES travel(travel_id)
	);
    
CREATE TABLE travel (
	travel_id		INT			AUTO_INCREMENT,
    travel_type		VARCHAR(50)	NOT NULL,
    travel_duration		TIME	NOT NULL,
    PRIMARY KEY (travel_id),
	FOREIGN KEY (card_id) REFERENCES card(card_id)
    );
    
CREATE TABLE city (
	city_id			INT				AUTO_INCREMENT,
    city_name		VARCHAR(255)	NOT NULL,
    city_country 	VARCHAR(255)	NOT NULL,
    city_latitude	FLOAT			NOT NULL,
    city_longitude	FLOAT			NOT NULL,
    city_start_date	DATETIME		NOT NULL,
    city_end_date	DATETIME		NOT NULL,
    PRIMARY KEY (city_id),
    FOREIGN KEY (trip_id) REFERENCES trip(trip_id)
	);

/* Future additions
CREATE TABLE edit_permission (
	person_id	INT	NOT NULL,
    trip_id		INT NOT NULL,
    PRIMARY KEY (person_id, trip_id),
    FOREIGN KEY (person_id) REFERENCES person(person_id),
    FOREIGN KEY (trip_id) REFERENCES trip(trip_id)
	);

CREATE TABLE trip_comment (
	trip_comment_id			INT		AUTO_INCREMENT,
    trip_comment_content	TEXT	NOT NULL,
    PRIMARY KEY (trip_comment_id),
    FOREIGN KEY (trip_id) REFERENCES trip(trip_id)
    );
*/
