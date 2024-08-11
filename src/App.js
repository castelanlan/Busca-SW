import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  function handleSearch(e) {
    console.log(e.target.value)
    setSearch(e.target.value)
    fetch(`https://swapi.dev/api/people/?search=${e.target.value}`)
      .then(data => data.json())
      .then(data => {
        console.log(data)
        setData(data)
        console.log("Filmes")
      })
  }

  useEffect(() => {
    fetch("https://swapi.dev/api/people/?search=")
      .then(data => data.json())
      .then(data => {
        setData(data)
      })
  }, [])

  return (
    <div className="App">
      <input type='text' id='busca' value={search} onChange={handleSearch} autoFocus />

      {Object.keys(data).length ? (
        <div className='results-gallery'>
          {data.results.map((personagem, index) => (
            <div className={`results-${index}`}>
              <p>{personagem.name}</p>
              {/* <p>{personagem.height}</p> */}
              {/* <p>{personagem.mass}</p> */}
              {/* <p>{personagem.hair_color}</p> */}
              {/* <p>{personagem.skin_color}</p> */}
              <p>{personagem.birth_year}</p>
              <p>{personagem.gender}</p>
              <p>{personagem.eye_color}</p>
              {/* <p>{personagem.homeworld}</p> */}
              <p>{personagem.films}</p>
              {/* <p>{personagem.species}</p> */}
              {/* <p>{personagem.vehicles}</p> */}
              {/* <p>{personagem.starships}</p> */}
              {/* <p>{personagem.created}</p> */}
              {/* <p>{personagem.edited}</p> */}
              {/* <p>{personagem.url}</p> */}
            </div>
          ))
          }
        </div>
      ) : (
        <p>Busque pelo seu personagem</p>
      )}
    </div >
  );
}

export default App;
