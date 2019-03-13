# Behavioral Data Tracker v.1 (Prototype Phase)
A Behavioral Tracking Application for whole-interval recording, designed for ease of use and to reduce redundant data entry in many classroom behavioral tracking systems. This application collects data and updates charts in real time to display behavioral trends to help professionals evaluate the effectiveness of behavioral interventions.  Although the app was specifically designed for use with students with severe emotional/behavioral disabilities requiring frequent behavioral monitoring, it can be used by teachers serving any population of students.  Please note that this is a prototype for further development incorporating fictitious data and does NOT incorporate security measures to protect student data.  Please do NOT use this version to store any real student data.  The developers are not responsible for the misuse of this application.

## Developed by: Sarah Kinneer, Billy Sterling, and Jodi Woodard
## January, 2019

![Photo of Chart from Behavioral Tracking App](assets/images/bxData.png)

## Technologies Used:
HTML5, CSS3, Bootstrap, JavaScript, jQuery, Firebase, Moment.js, Chart.js, Modals, They Said So API (quote of the day), Farm Sense API (moon phases), Jokes One API (joke of the day), Open Weather API (current weather)

## Link to Live Site:
- [Log some (fictional) data!](https://kinneers.github.io/bdt_v1) - Head to the live site and play with the app!

## To Use the Live Site:
- To enter a new student/behavior, simply use the form at the bottom of the browser to add the student's name and target behavior.
- At intervals determined by the teacher or team working with the students, staff can rate whether or not each student met his/her goal for that interval using the drop-down menus for each student and clicking or tapping the "Save Changes" button.  Note that the option N/A is available in case a student is absent or not tracked during that interval for some other reason.
- Each time a behavior is rated, the percentage of times the goal was met out of the number of ratings so far that day is updated in the "Today's Progress" table.
- At the end of the day, the red "Save Progress" button must be clicked to add the day's percentages to each student's behavioral chart.
- Users can use the left and right arrows at any time to navigate through the carousel and view each student's behavior chart.

## Future Development:
- There are plans to develop this application further, including using a more robust database, adding additional behavioral monitoring features (such as student self-monitoring, frequency counts, duration recording, random instance recording, etc.), and adding security measures to ensure that student data is protected per FERPA regulations.

## Sources:
Many thanks to the creators of the They Said So, Farm Sense, Jokes One, and Open Weather APIs!
