/* start the external action and say hello */
console.log("App is alive");


/** #7 Create global variable */
var currentChannel;

/** #7 We simply initialize it with the channel selected by default - sevencontinents */
currentChannel = sevencontinents;

/** Store my current (sender) location
 */
var currentLocation = {
    latitude: 48.249586,
    longitude: 11.634431,
    what3words: "shelf.jetted.purple"
};

/**
 * Switch channels name in the right app bar
 * @param channelObject
 */
function switchChannel(channelObject) {
    //Log the channel switch
    console.log("Tuning in to channel", channelObject);

    // #7  Write the new channel to the right app bar using object property
    document.getElementById('channel-name').innerHTML = channelObject.name;

    //#7  change the channel location using object property
    document.getElementById('channel-location').innerHTML = 'by <a href="http://w3w.co/'
        + channelObject.createdBy
        + '" target="_blank"><strong>'
        + channelObject.createdBy
        + '</strong></a>';

    /* #7 remove either class */
    $('#chat h1 button i').removeClass('far fas');

    /* #7 set class according to object property */
    $('#chat h1 button i').addClass(channelObject.starred ? 'fas' : 'far');


    /* highlight the selected #channel.
       This is inefficient (jQuery has to search all channel list items), but we'll change it later on */
    $('#channels li').removeClass('selected');
    $('#channels li:contains(' + channelObject.name + ')').addClass('selected');

    /* #7 store selected channel in global variable */
    currentChannel = channelObject;
}

/* liking a channel on #click */
function star() {
    // Toggling star
    // #7 replace image with icon
    $('#chat h1 button i').toggleClass('fas');
    $('#chat h1 button i').toggleClass('far');

    // #7 toggle star also in data model
    currentChannel.starred = !currentChannel.starred;

    // #7 toggle star also in list
    $('#channels li:contains(' + currentChannel.name + ') .fa').removeClass('fas far');
    $('#channels li:contains(' + currentChannel.name + ') .fa').addClass(currentChannel.starred ? 'fas' : 'far');
}

/**
 * Function to select the given tab
 * @param tabId #id of the tab
 */
function selectTab(tabId) {
    $('#tab-bar button').removeClass('selected');
    console.log('Changing to tab', tabId);
    $(tabId).addClass('selected');
}

/**
 * toggle (show/hide) the emojis menu
 */
function toggleEmojis() {
    $('#emojis').toggle(); // #toggle
}

/**
 * #8 This #constructor function creates a new chat #message.
 * @param text `String` a message text
 * @constructor
 */
function Message(text) {
    // copy my location
    this.createdBy = currentLocation.what3words;
    this.latitude = currentLocation.latitude;
    this.longitude = currentLocation.longitude;
    // set dates
    this.createdOn = new Date() //now
    this.expiresOn = new Date(Date.now() + 15 * 60 * 1000); // mins * secs * msecs
    // set text
    this.text = text;
    // own message
    this.own = true;
}

function sendMessage() {
    // #8 Create a new message to send and log it.
    //var message = new Message("Hello chatter");

    // #8 let's now use the real message #input
    var text= $('#message').val()
        if(text.length==0){
            alert("Please enter some text");
            return ;
    }
    var message = new Message(text);
    // #8 convenient message append with jQuery:
    $('#messages').append(createMessageElement(message));
    currentChannel.messages.push(message);
    currentChannel.messageCount+=1;

    // #8 messages will scroll to a certain point if we apply a certain height, in this case the overall scrollHeight of the messages-div that increases with every message;
    // it would also scroll to the bottom when using a very high number (e.g. 1000000000);
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));

    // #8 clear the message input
    $('#message').val('');
}

/**
 * #8 This function makes an html #element out of message objects' #properties.
 * @param messageObject a chat message object
 * @returns html element
 */
function createMessageElement(messageObject) {
    // #8 message properties
    var expiresIn = Math.round((messageObject.expiresOn - Date.now()) / 1000 / 60);

    // #8 message element
    return '<div class="message'+
        //this dynamically adds the class 'own' (#own) to the #message, based on the
        //ternary operator. We need () in order to not disrupt the return.
        (messageObject.own ? ' own' : '') +
        '">' +
        '<h3><a href="http://w3w.co/' + messageObject.createdBy + '" target="_blank">'+
        '<strong>' + messageObject.createdBy + '</strong></a>' +
        messageObject.createdOn.toLocaleString() +
        '<em>' + expiresIn+ ' min. left</em></h3>' +
        '<p>' + messageObject.text + '</p>' +
        '<button class="accent">+5 min.</button>' +
        '</div>';
}

var channels=[
    yummy,
    sevencontinents,
    killerapp,
    firstpersononmars,
    octoberfest
]
function compareNew(channelA, channelB){
    return (channelA.createdOn-channelB.createdOn);
}
function compareTrending(channelA,channelB){
    return (channelA.messageCount-channelB.messageCount);
}
function compareFavorites(channelA, channelB){
    return channelA.starred?-1:1
}
function listChannels(criterion) {
    // #8 channel onload
    //$('#channels ul').append("<li>New Channel</li>")
    $('#channels ul').empty(); 
    channels.sort(criterion);
    // #8 five new channels
    for(i=0;i<channels.length;i++){
    $('#channels ul').append(createChannelElement(channels[i]));
   }
}

/**
 * #8 This function makes a new jQuery #channel <li> element out of a given object
 * @param channelObject a channel object
 * @returns {HTMLElement}
 */
function createChannelElement(channelObject) {
    /* this HTML is build in jQuery below:
     <li>
     {{ name }}
        <span class="channel-meta">
            <i class="far fa-star"></i>
            <i class="fas fa-chevron-right"></i>
        </span>
     </li>
     */

    // create a channel
    var channel = $('<li>').text(channelObject.name);

    // create and append channel meta
    var meta = $('<span>').addClass('channel-meta').appendTo(channel);

    // The star including star functionality.
    // Since we don't want to append child elements to this element, we don't need to 'wrap' it into a variable as the elements above.
    $('<i>').addClass('fa-star').addClass(channelObject.starred ? 'fas' : 'far').appendTo(meta);

    // #8 channel boxes for some additional meta data
    $('<span>').text(channelObject.expiresIn + ' min').appendTo(meta);
    $('<span>').text(channelObject.messageCount + ' new').appendTo(meta);

    // The chevron
    $('<i>').addClass('fas').addClass('fa-chevron-right').appendTo(meta);

    // return the complete channel
    return channel;
}
function LoadEmojis() {
    var emojis = require('emojis-list');
    $('#emojis').empty();
    for (emoji in emojis) {
        $('#emojis').append(emojis[emoji] + " ");
    }
}
function addChannel(){
    $('#messages').empty();
    $('#app-bar-old').hide();
    $('#send-button').hide();
    $('#create-button').show();
    $('#app-bar-new').addClass('show');
}
function abort(){
    $('#messages').show();
    $('#app-bar-new').removeClass('show');
    $('#app-bar-old').show();
    $('#create-button').hide();
    $('#send-button').show();
}
function Channel(name) {
    // copy my location
    this.createdBy = currentLocation.what3words;
    // set dates
    this.createdOn = new Date(); //now
    this.expiresIn = 60; // this is just temporary
    // set name
    this.name = name;
    // set favourite
    this.starred = false;
    // set messages array and message count
    this.messages = [];
    this.messageCount = 0;
}

function createChannel(){
    var name = $('#new-channel').val();
    var text = $('#message').val();
    if (name.length == 0 || name.search(" ") > -1 || name.search("#") == -1){
        alert('Enter valid channel name!("#"at the beginning, no spaces)');
        return;
    } else if(!text){
        alert('Enter an initial message!'); 
        return;
    } else{
        var channel = new Channel(name);
        currentChannel= channel;
        channels.push(channel);
        $('#channels ul').append(createChannelElement(channel));
        // Log channel creation.
        console.log('New channel: ' + channel);
        // Send initial message.
        sendMessage();
        // Empty channel name input field.
        $('#new-channel').val('');
        // Return to normal view.
        abort();
        // #show #new channel's data
        document.getElementById('channel-name').innerHTML = channel.name;
        document.getElementById('channel-location').innerHTML = 'by <a href="http://w3w.co/'
            + channel.createdBy
            + '" target="_blank"><strong>'
            + channel.createdBy
            + '</strong></a>';
    }

    }

