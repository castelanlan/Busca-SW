import './App.css';

import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { useState, useEffect } from 'react';

function Main() {
  const [search, setSearch] = useState("");
  const [people, setPeople] = useState([])
  const [selec, setSelec] = useState([]);

  function handleSearch(event) {
    const pesquisa = event.target.value.toLowerCase();
    setSearch(pesquisa)

    setSelec(
      people.filter((person) => (
        person[0].toLowerCase().includes(pesquisa)
      ))
    );

    console.log(people)
  }

  useEffect(() => {
    const personagens = [];

    const fetchCharacters = async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        var personagem = (data.results) ? (data.results.map(person => [person.name, person.url.split('/')[5], person.birth_year, person.gender, person.eye_color, person.films])) : (console.log(`DEU RUIM -> ${data}`))
        personagens.push(...personagem);
        console.log(personagens)

        if (data.next) {
          await fetchCharacters(data.next);
        }
        else {
          setPeople(personagens)
        }
      } catch (error) {
        console.error("Error fetching characters:", error);
      }
    };

    fetchCharacters("https://swapi.py4e.com/api/people/"); // ! api + rápida
  }, [])

  return (
    <div>
      <input type='text' id='busca' value={search} onChange={handleSearch} placeholder='Pesquise aqui' autoFocus />
      {selec.length ? (
        <div className='results-gallery'>
          {selec.map((personagem) => (
            <div>
              <p><Link key={personagem[0]} to={`/${(personagem[1])}`}>{personagem[0]}</Link></p>
            </div>
          ))
          }
        </div>
      ) : (
        <p>Busque pelo seu personagem</p>
      )}
    </div>
  )
}

function Details() {
  const { id } = useParams();
  var [charState, setCharState] = useState({})
  var [allFilms, setAllFilms] = useState({})


  useEffect(() => {
    fetch('https://swapi.py4e.com/api/films').then(res => res.json())
      .then(res => {
        console.log(1)
        var all_films = res["results"]
        setAllFilms(all_films)
        console.log(2)
      }).then(() => {
        fetch(`https://swapi.py4e.com/api/people/${id}/`)
        .then(res => res.json()).then(res => {
          console.log(3)
          console.log(allFilms)
          
          var name = res["name"]
          var birth_year = res["birth_year"]
          var gender = res["gender"]
          var eye_color = res["eye_color"]
          var filmes = res["films"].map(filme => Number(filme.split("/")[5]))
          var filmes_info = []
          
          console.log(4)
          for (let index = 0; index < filmes.length; index++) {
            const filme_index = filmes[index];
            console.log(allFilms)
            filmes_info.push([allFilms[filme_index - 1].title, allFilms[filme_index - 1].release_date])
          }
          
          console.log(5)
            setCharState({
              "name": name,
              "birth_year": birth_year,
              "gender": gender,
              "eye_color": eye_color,
              "filmes": filmes_info
            })
          })
      })
  }, [])

  return (
    <>
      <h2>Detalhes do personagem</h2>
      <p>{charState.name}</p>
      <p>{charState.birth_year}</p>
      <p>{charState.gender}</p>
      <p>{charState.eye_color}</p>
      <p>{charState.filmes}</p>
      {charState.filmes ? (charState.filmes.map((filme) => {
        <div>
          <p>{filme[0]}</p>
          <p>{filme[1]}</p>
        </div>
      })) : (<></>)}
      <p>{charState.filmes_info}</p>
    </>
  )
}


function App() {

  return (
    <div className="App">
      <Routes>

        <Route path='/' element={<Main />} />
        <Route path='/:id' element={<Details />} />
      </Routes>
    </div >
  );
}

export default App;
