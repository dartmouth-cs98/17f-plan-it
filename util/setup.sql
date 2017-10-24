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
    FOREIGN KEY (person_id) 	 REFERENCES person(person_id),
	FOREIGN KEY (first_card_id)  REFERENCES card(card_id),
	FOREIGN KEY (last_card_id)   REFERENCES card(card_id)
    );
    
CREATE TABLE day (
	day_number		INT 	NOT NULL,
    PRIMARY KEY (trip_id, day_number),
    FOREIGN KEY (trip_id)       REFERENCES trip(trip_id),
    FOREIGN KEY (first_card_id) REFERENCES card(card_id),
	FOREIGN KEY (last_card_id)  REFERENCES card(card_id)
    );
    
CREATE TABLE card (
	card_id			INT			 AUTO_INCREMENT,
    card_type		VARCHAR(50)	 NOT NULL,
    card_name		VARCHAR(50)	 NOT NULL,
    card_city		VARCHAR(255) NOT NULL,
    card_address	VARCHAR(255) NOT NULL,
	card_start_time	DATETIME	 NOT NULL,
    card_end_time	DATETIME	 NOT NULL,
    PRIMARY KEY	(card_id)
	);
    
CREATE TABLE travel (
	travel_id		INT			AUTO_INCREMENT,
    travel_type		VARCHAR(50)	NOT NULL,
    travel_time		TIME		NOT NULL,
    FOREIGN KEY (start_card_id)	REFERENCES card(card_id),
    FOREIGN KEY	(end_card_id)	REFERENCES card(card_id)
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

/* Not needed
INSERT INTO person (person_fname, person_lname, person_email, person_username, person_password, person_birthday)
VALUES 
("Mara","King","dolor.quam.elementum@tinciduntpedeac.edu","mking","XRK69CTJ5DY","1955-11-09"),
("Scarlet","Welch","augue.eu@congue.edu","swelch","SIC04BZS1GQ","1963-10-20"),
("Celeste","Allen","placerat.Cras@per.co.uk","callen","MOR87SJJ5BQ","1967-07-26"),
("Breanna","Mcclure","mi.pede.nonummy@velit.com","bmcclure","SJB25XYB9OQ","1962-07-30"),
("Lysandra","Hickman","Suspendisse@euismodac.com","lhickman","OPY15KJB5EZ","1954-08-15"),
("Arden","Rollins","ligula.Donec@quama.net","arollins","JKL23VNE2CS","1988-02-15"),
("Joy","Walker","commodo.tincidunt.nibh@VivamusrhoncusDonec.ca","jwalker","LYK53RFD2WW","1960-10-02"),
("Flynn","Wilkinson","eu.tellus.Phasellus@lorem.ca","fwilkinson","NNE10WAZ8QU","1978-06-08"),
("Tanya","Wong","ornare@eget.ca","twong","MLK62SFI7FW","1952-12-28"),
("Lee","Dorsey","lorem.lorem@auctor.edu","ldorsey","BKI98IDI4IO","1986-06-04");


INSERT INTO trip (trip_name, trip_upvotes, person_id, first_card_id)
VALUES ();

INSERT INTO card (card_type, card_name, card_location, card_start_time, card_end_time)
VALUES ();

INSERT INTO travel (travel_type, travel_time, start_card_id, end_card_id) 
VALUES ();
*/  