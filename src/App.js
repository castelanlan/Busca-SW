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
        <p>Busque pelo seu personagem favorito de Star Wars!</p>
      )}
    </div>
  )
}

function Details() {
  const { id } = useParams();
  var [charState, setCharState] = useState({})
  var [allFilms, setAllFilms] = useState([])

  useEffect(() => {
    fetch('https://swapi.py4e.com/api/films').then(res => res.json())
      .then(res => {
        var all_films = res["results"]
        setAllFilms(all_films)
      })
  }, [])

  useEffect(() => {
    fetch(`https://swapi.py4e.com/api/people/${id}/`)
      .then(res => res.json()).then(res => {

        var name = res["name"]
        var birth_year = res["birth_year"]
        var gender = res["gender"]
        var eye_color = res["eye_color"]
        var filmes = res["films"].map(filme => Number(filme.split("/")[5]))
        var filmes_info = []

        if (allFilms.length > 0) {
          for (let index = 0; index < filmes.length; index++) {
            const filme_index = filmes[index];
            filmes_info.push([allFilms[filme_index - 1].title, allFilms[filme_index - 1].release_date])
          }

          setCharState({
            "name": name,
            "birth_year": birth_year,
            "gender": gender,
            "eye_color": eye_color,
            "filmes": filmes_info
          })
          // console.log(charState)
        } else { }

      })
  }, [id, allFilms])

  return (
    <div>
      <h1>Detalhes do personagem</h1>
      <div>Nome <h2 style={{display: 'inline'}}><strong>{charState.name}</strong></h2></div>
      <div>Ano de nascimento <h2 style={{display: 'inline'}}><strong>{charState.birth_year}</strong></h2></div>
      <div>Gênero <h2 style={{display: 'inline'}}><strong>{charState.gender}</strong></h2></div>
      <div>Cor do olho <h2 style={{display: 'inline'}}><strong>{charState.eye_color}</strong></h2></div>
      <p><strong>Filmes {charState.filmes ? `(${charState.filmes.length})` : <></>}:</strong></p>
      <div>
        {charState.filmes ? (charState.filmes.map((filme) => (
          <div key={filme[0]}>
            <span key={filme[0]}><strong>{filme[0]}</strong></span> <span key={filme[1]}>{filme[1]}</span>
          </div>
        ))) : (<></>)}
      </div>
      <div id='voltar'>
        <Link to={'/'}>Voltar</Link>
      </div>
    </div>
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
