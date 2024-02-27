'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputTemp = document.querySelector('.form__input--temp');
const inputClimb = document.querySelector('.form__input--climb');

let map, mapEvent;

if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
        function(position){
            const {latitude} = position.coords;
            const {longitude} = position.coords;
            console.log(`https://www.google.com/maps/@${latitude},${longitude},15z?entry=ttu`)
            
            const coords = [latitude, longitude];

            map = L.map('map').setView(coords, 15);
            // console.log(map)

            L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // click na mapie
            map.on('click', function(event){
                mapEvent = event;
                form.classList.remove('hidden')
                inputDistance.focus();


                
            })
            },
        function(){
            alert("Brak dostępu do GPS")
        }
        )
}

form.addEventListener('submit', function(event){
    event.preventDefault()
    // reset input
    inputClimb.value=inputDistance.value=inputDuration.value=inputTemp.value='';
    // dodawanie pinezki
    console.log(mapEvent)
    const {lat, lng} = mapEvent.latlng

    L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
        L.popup({
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup'
    }))
    .setPopupContent('Trening')
    .openPopup();
})

inputType.addEventListener('change', function(){
    inputClimb.closest('.form__row').classList.toggle('form__row--hidden')
    inputTemp.closest('.form__row').classList.toggle('form__row--hidden')
})