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
    clickNumber = 0;

    constructor(coords, distance, duration){
        this.coords = coords;
        this.distance = distance; 
        this.duration = duration;
    }

    _setDescription(){
        this.type === 'running' 
        ? this.description = `Bieg ${new Intl.DateTimeFormat('pl-Pl').format(this.date)}` 
        : this.description = `Rower ${new Intl.DateTimeFormat('pl-Pl').format(this.date)}`
    }

    click(){
        this.clickNumber++
    }
}

class Running extends Workout {

    type = 'running'

    constructor(coords, distance, duration, temp){
        super(coords, distance, duration)
        this.temp = temp
        this.calculatePace()
        this._setDescription()
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
        this._setDescription()
    }

    calculateSpeed(){
        this.speed = this.distance / this.duration / 60
    }
}


class App {

    #map;
    #mapEvent;
    #workouts = [];

    constructor(){
        this._getPosition();
        this._getLocalStorageData()
        form.addEventListener('submit', this._newWorkout.bind(this))
        inputType.addEventListener('change', this._toggleClimbField)
        containerWorkouts.addEventListener('click', this._moveToWorkout.bind(this))

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

            this.#workouts.forEach(workout=>{
                this._displayWorkout(workout)
            })
            }
        

    _showForm(e){
        this.#mapEvent = e;
        form.classList.remove('hidden')
        inputDistance.focus();
    }

    _hideForm(){
        inputClimb.value=
        inputDistance.value=
        inputDuration.value=
        inputTemp.value=
            '';
            form.classList.add('hidden')
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
        
        this._displayWorkout(workout)

        // wyświetlić trening na liście treningów
        this._displayWorkoutOnSidebar(workout)

        // hide form and reset input 
        this._hideForm()

        // zapisać wszystkie treningi w "localStorage"
        this._addWorkoutsToLocalStorage()

    }

    _displayWorkout(workout){
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
        .setPopupContent(`${workout.type === 'running' ? '🏃' : '🚵‍♂️'} ${workout.description}`)
        .openPopup();
    }

    _displayWorkoutOnSidebar(workout){
        
        let html = `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
            <h2 class="workout__title">${workout.description}</h2>
            <div class="workout__details">
                <span class="workout__icon">${workout.type === 'running' ? '🏃' : '🚵‍♂️'}</span>
                <span class="workout__value">${workout.distance}</span>
                <span class="workout__unit">km</span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">⏱</span>
                <span class="workout__value">${workout.duration}</span>
                <span class="workout__unit">min</span>
            </div>
        `

        if(workout.type === 'running'){
            html += `
            <div class="workout__details">
            <span class="workout__icon">📏⏱</span>
            <span class="workout__value">${workout.pace.toFixed(2)}</span>
            <span class="workout__unit">m/<br>min</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">👟⏱</span>
            <span class="workout__value">${workout.temp}</span>
            <span class="workout__unit">kroku/<br>min</span>
          </div>
        </li>
            `
        }

        if(workout.type === 'cycling'){
            html += `
            <div class="workout__details">
            <span class="workout__icon">📏⏱</span>
            <span class="workout__value">${workout.speed.toFixed(2)}</span>
            <span class="workout__unit">km/<br>g</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🏔</span>
            <span class="workout__value">${workout.climb}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>
            `
        }

        form.insertAdjacentHTML('afterend', html)
    }

    _moveToWorkout(e){
        const workoutElement = e.target.closest('.workout')
        // console.log(workoutElement)

        if(!workoutElement) return
        // console.log(workoutElement)
        const workout = this.#workouts.find(item=>item.id === workoutElement.dataset.id)
        // console.log(workout)
        this.#map.setView(workout.coords, 16, {
            animate:true,
            pan: {
                duration: 1,
            }
        })
    }

    _addWorkoutsToLocalStorage(){
        localStorage.setItem('workouts', JSON.stringify(this.#workouts))
    }

    _getLocalStorageData(){
        const data = JSON.parse(localStorage.getItem('workouts'))
        // console.log(data)

        if(!data) return;

        this.#workouts = data;

        this.#workouts.forEach(workout=>{
            this._displayWorkoutOnSidebar(workout)
            // this._displayWorkout(workout)
        })
    }

    resizeTo(){
        localStorage.removeItem('workouts')
        location.reload()
    }
}

const app = new App();