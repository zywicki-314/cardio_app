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

    type = 'running'

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

    type = 'cycling'

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
    #workouts = [];

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

        const areNumbers = (...numbers) => numbers.every(num=>Number.isFinite(num))

        const areNumbersPositive = (...numbers)=>numbers.every(num=>num>0)

        e.preventDefault()

        const {lat, lng} = this.#mapEvent.latlng;
        let workout;


        //  dane z formy
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        
        // jeśli rodzaj treningu to "bieg" - stworzyć nowy obiekt Running
        if(type === 'running'){
            // czy dane prawidłowe
            const temp = +inputTemp.value
            if(
                // !Number.isFinite(distance) || 
                // !Number.isFinite(duration) || 
                // !Number.isFinite(temp)
                !areNumbers(distance, duration, temp) ||
                !areNumbersPositive(distance, duration, temp)
            ) 
                return alert('Wprowadź dodatnią liczbę')

            workout = new Running([lat, lng], distance, duration, temp)
            // this.#workouts.push(workout)
        }
        // jerzeli rodzaj treningu to "rower" - stworzyć nowy obiekt Cycling
        if(type === 'cycling'){
            // czy dane prawidłowe
            const climb = +inputClimb.value
            if(
                // !Number.isFinite(distance) || 
                // !Number.isFinite(duration) || 
                // !Number.isFinite(climb)
                !areNumbers(distance, duration, climb) ||
                !areNumbersPositive(distance, duration)
                
            ) 
                return alert('Wprowadź dodatnią liczbę')

            workout = new Cycling([lat, lng], distance, duration, climb)
            
        }
        // dodać nowy obiekt do tabeli treningów

        this.#workouts.push(workout)
        // console.log(workout)


        // wyświetlić trening na mapie
        
        this.displayWorkout(workout)

        // wyświetlić trening na liście treningów
            // hide form and reset input 
            inputClimb.value=
            inputDistance.value=
            inputDuration.value=
            inputTemp.value=
                '';

    }

    displayWorkout(workout){
        L.marker(workout.coords)
        .addTo(this.#map)
        .bindPopup(
            L.popup({
            maxWidth: 200,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: `${workout.type}-popup` 
        }))
        .setPopupContent('Trening')
        .openPopup();
    }
}

const app = new App();

// 

