var people = [];
var index = 0;
var timer;
var LEFT_ARROW = '\u21D0';
var RIGHT_ARROW = '\u21D2';
var FADE_DELAY = 800;
var TIMER_INTERVAL = 10000;

$(document).ready(function(){
    getData();
});

//Once data is received from the server, the page is build and event listeners
//are enabled...
function getData(){
    $.ajax({
        type: "GET",
        url:"/data",
        success: function(data){
            people = data.people;
            buildPage();
            enable();
        }
    });
}

//Places buttons and information / spirit animal display onto the page.
//Note that the call to switchPerson also initializes the slideshow timer.
function buildPage(){
    $('.nav-left').append('<button class="left-arrow">' + LEFT_ARROW + '</button>');
    $('.nav-right').append('<button class="right-arrow">' + RIGHT_ARROW + '</button>');
    var $el = $('.nav-index');
    for (var i = 0; i < people.length; i++){
        $el.append('<button class="index-point" id="' + i + '"></button>');
    }
    switchPerson(0);
}

//Event listeners for next/prev-arrow and index buttons.
function enable(){
    $('body').on('click', '.left-arrow', prevPerson);
    $('body').on('click', '.right-arrow', nextPerson);
    $('body').on('click', '.index-point', specPerson);
}

//Display the next person in the list; loop to beginning as needed.
function nextPerson(){
    index++;
    if (index >= people.length) index = 0;
    switchPerson(index);
}

//Display the previous person in the list; loop to end as needed.
function prevPerson(){
    index--;
    if (index < 0) index = people.length - 1;
    switchPerson(index);
}

//Display the selected person in the list.
function specPerson(){
    var index = parseInt($(this).attr('id'));
    switchPerson(index);
}

//1) Clear the person/spirit animal display.
//2) Display/fade-in the selected person's information.
//3) Set appropriate index button class to "active" for styling purposes.
//4) Restart a timed call to nextPerson().
function switchPerson(index){
    var person = people[index];
    var toAppend = '<h4 class="name">' + person.name + '</h4>' +
        '<p class="location">' + person.location + '</p>' +
        '<p class="animal">' + person.animal + '</p>';

    animatePerson(toAppend);
    activateIndexButton(index);

    clearInterval(timer);
    timer = setInterval(function(){
        nextPerson();
    }, TIMER_INTERVAL);
}

//Clears existing person's info, adds new, and fades-into display.
function animatePerson(textToAppend){
    var $el = $('.peopleContainer');
    $el.children().remove();
    $el.append(textToAppend);
    $el.children().hide();
    $el.children().fadeIn(FADE_DELAY);
}

//Clears active class from all index buttons, then sets it for the
//specified index only.
function activateIndexButton(index){
    $('.index-point').removeClass('active');
    $('#' + index).addClass('active');
}
