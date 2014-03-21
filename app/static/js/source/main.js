/* global google:true */
(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    initLocationProcedure();
    $('#ping').click(pingUser);
  }

  function pingUser(){
    alert('you just ping someone');
  }

  var map,
      currentPositionMarker,
      mapCenter = new google.maps.LatLng(36.1667, -86.7833),
      positionTimer;

  var styleArray = [{'featureType':'administrative','stylers':[{'visibility':'off'}]},{'featureType':'poi','stylers':[{'visibility':'simplified'}]},{'featureType':'road','stylers':[{'visibility':'simplified'}]},{'featureType':'water','stylers':[{'visibility':'simplified'}]},{'featureType':'transit','stylers':[{'visibility':'simplified'}]},{'featureType':'landscape','stylers':[{'visibility':'simplified'}]},{'featureType':'road.highway','stylers':[{'visibility':'off'}]},{'featureType':'road.local','stylers':[{'visibility':'on'}]},{'featureType':'road.highway','elementType':'geometry','stylers':[{'visibility':'on'}]},{'featureType':'water','stylers':[{'color':'#84afa3'},{'lightness':52}]},{'stylers':[{'saturation':-77}]},{'featureType':'road'}];

  function initializeMap(){
    var mapOptions = {center: mapCenter, zoom: 13, mapTypeId: google.maps.MapTypeId.ROADMAP, styles:styleArray};
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  function locError(error){
    alert('The current Position could not be found!');
  }

  function setCurrentPosition(pos){
    currentPositionMarker = new google.maps.Marker({
      map:map,
      position: new google.maps.LatLng(
        pos.coords.latitude, pos.coords.longitude
        ),
      title: 'Current Position'
    });
    map.panTo(new google.maps.LatLng(
          pos.coords.latitude,
          pos.coords.longitude
          ));
  }

  function displayAndWatch(position){
    setCurrentPosition(position);
    watchCurrentPosition();
  }

  function watchCurrentPosition(){
    positionTimer = navigator.geolocation.watchPosition(
      function(position){
        setMarkerPosition(
          currentPositionMarker,
          position
        );
      });
  }

  function setMarkerPosition(marker, position){
    marker.setPosition(
      new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude)
      );
  }

  function initLocationProcedure(){
    initializeMap();
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(displayAndWatch, locError);
    }else{
      alert('your browser does have Geolocation enabled');
    }
  }

})();

