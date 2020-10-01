# public-cellphone-reactnative-cell-imager
Public version upload of react native app that excludes api key and firebase specifics.


This application allows a cellphone to take a picture through a microscope at a set artificial zoomed viewpoint with a crosshair to center the cell onto. 

Once picture is taken, this image is temporarily stored and displayed on the cellphone while the database server is pinged and readied for link storage. When ready, an indicator will turn green and allow the user to click on it so the image is saved onto a firebase image storage and it's link of the firebase storage lcoation is stored onto a heroku SQL database.  The SQL server allows all the links to be organized and for a CSV file to produced.

The purpose of this application is to data collect for a machine learning image recognition application(potential work in progress) that will require several thousand images of 1 particular cellular organism, the white blood cell - Neutrophil, mature segmented form only.