$(document).ready(function() {

    //API call to They Said So for inspirational quote of the day
    $.ajax({
        url: "http://quotes.rest/qod.json?category=inspire",
        method: "GET"
    }).then(function(response){
        $('#quote').text(response.contents.quotes[0].quote);
        $('#source').text(response.contents.quotes[0].author);
    })

    //API call for Joke of the Day
    getJoke();

        function getJoke() {
            var queryURL = "https://api.jokes.one/jod";
            $.ajax({
            //$.getJSON({
                url: queryURL,
                method: "GET"
            })
            .then(function(response) {
                console.log(response.contents.jokes[0].joke.text);
                $("#joke").text(response.contents.jokes[0].joke.text);
            });
        };
})

