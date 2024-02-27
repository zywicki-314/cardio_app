'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputTemp = document.querySelector('.form__input--temp');
const inputClimb = document.querySelector('.form__input--climb');

class Workout {
    date = new Date();
    id = (Date.now() + '').slice(-10);

    constructor(coords, distance, duration){
        this.coords = coords;
        this.distance = distance; 
        this.duration = duration;
    }
}

class Running extends Workout {

    constructor(coords, distance, duration, temp){
        super(coords, distance, duration)
        this.temp = temp
        this.calculatePace()
    }

    calculatePace(){
        this.pace = this.duration / this.distance
    }
}
class Cycling extends Workout {

    constructor(coords, distance, duration, climb){
        super(coords, distance, duration)
        this.climb = climb
        this.calculateSpeed()
    }

    calculateSpeed(){
        this.speed = this.distance / this.duration / 60
    }
}

// const running = new Running((50, 39), 7, 40, 170)
// const cyckling = new Cycling((50, 39), 37, 80, 800)
// console.log(running, cyckling)

class App {

    #map;
    #mapEvent;
    constructor(){
        this._getPosition();

        form.addEventListener('submit', this._newWorkout.bind(this))
        
        inputType.addEventListener('change', this._toggleClimbField)

    }

    _getPosition(){
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                this._loadMap.bind(this),
                function(){
                    alert("Brak dostępu do GPS")
                
                }
            )
        }
    }

    _loadMap(position){
            const {latitude} = position.coords;
            const {longitude} = position.coords;
            console.log(`https://www.google.com/maps/@${latitude},${longitude},15z?entry=ttu`)
            
            const coords = [latitude, longitude];

            this.#map = L.map('map').setView(coords, 15);
            // console.log(map)

            L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.#map);

            // click na mapie
            this.#map.on('click', this._showForm.bind(this))
            }
        

    _showForm(e){
        this.#mapEvent = e;
        form.classList.remove('hidden')
        inputDistance.focus();
    }

    _toggleClimbField(){
        inputClimb.closest('.form__row').classList.toggle('form__row--hidden')
        inputTemp.closest('.form__row').classList.toggle('form__row--hidden')
    }

    _newWorkout(e){
        e.preventDefault()
            // reset input
            inputClimb.value=
            inputDistance.value=
            inputDuration.value=
            inputTemp.value=
                '';
            // dodawanie pinezki
            const {lat, lng} = this.#mapEvent.latlng
        
            L.marker([lat, lng])
            .addTo(this.#map)
            .bindPopup(
                L.popup({
                autoClose: false,
                closeOnClick: false,
                className: 'running-popup'
            }))
            .setPopupContent('Trening')
            .openPopup();
    }
}

const app = new App();

// 

