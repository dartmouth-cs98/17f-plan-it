/* Planit
   Jeff Gao, Helen He, Sam Lee, Emily Lin, Rob Sayegh, Jiyun Sung | 17F/18W
   setup.sql */
   
USE plan_it_dev;

DROP TABLE IF EXISTS person;
DROP TABLE IF EXISTS edit_permission;
DROP TABLE IF EXISTS trip;
DROP TABLE IF EXISTS card;
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
    card_lat		FLOAT		 NOT NULL,
    card_long		FLOAT		 NOT NULL,
	card_start_time	DATETIME	 NOT NULL,
    card_end_time	DATETIME	 NOT NULL,
	card_day_number INT			 NOT NULL,
    travel_type		VARCHAR(50),
    travel_duration	TIME,
    PRIMARY KEY	(card_id),
	FOREIGN KEY (trip_id) 	REFERENCES trip(trip_id)
	);
    
CREATE TABLE favorited_trip (
	PRIMARY KEY (person_id, user_id),
    FOREIGN KEY (person_id) REFERENCES person(person_id),
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
