# Political Speeches

This is test project to get the latest polical speeches from given urls.
The implementation uses worker threads to fetch data and parse data from url in parallel.

# Question to the world:

Can anyone tell me how to run jest test with worker-thread? Which libs or settings do I need?

# How to run the project:

1. First install the required libraries with `npm install`
2. Build the project with `npm build`
3. Run the project with `npm start`
4. Test it by entering the following url into browerser `http://localhost:3000/evaluation?url=one.csv&url=two.csv`
5. You can add as many url as you want. A valid url should lead to a public resource of a valid csv file
6. Try it and give some feedbacks if it does not work

# Csv file format:

Speaker, Topic, Date, Words
Alexander Abel, Education Policy, 2012-10-30, 5310
Bernhard Belling, Coal Subsidies, 2012-11-05, 1210
Caesare Collins, Coal Subsidies, 2012-11-06, 1119
Alexander Abel, Internal Security, 2012-12-11, 911
