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
            <Link key={personagem[0]} to={`/${personagem[1].toLowerCase().replace(" ", "_")}`}>{personagem[0]}</Link>
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
}


function App() {

  return (
    <div className="App">
      <Routes>

        <Route path='/' element={<Main />} />
        <Route path='/:query' element={<Details />} />
      </Routes>
    </div >
  );
}

export default App;
