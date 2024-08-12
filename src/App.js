import './App.css';
import { useState, useEffect } from 'react';

function App() {
  // const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [people, setPeople] = useState([])
  const [selec, setSelec] = useState([]);

  function handleSearch(event) {
    const pesquisa = event.target.value.toLowerCase();
    setSearch(pesquisa)

    // console.log(people)
    setSelec(
      people.filter((person) => (
        // console.log(person);
        // console.log(pesquisa);
        // console.log(person.toLowerCase().includes(pesquisa))
        person.toLowerCase().includes(pesquisa)
      ))
    );

    console.log(selec)


    // people.forEach(p => p['id'] = p.url.split('/')[5]);

    // console.log(people)
    // console.log()
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
        var personagem = (data.results) ? (data.results.map(person => person.name)) : (console.log(`DEU RUIM -> ${data}`))
        personagens.push(...personagem);
        console.log(personagens)

        // Check for next page only if it exists
        if (data.next) {
          await fetchCharacters(data.next); // Recursive call to fetch next page
        }
        else {
          setPeople(personagens)
        }
      } catch (error) {
        console.error("Error fetching characters:", error);
      }
    };

    fetchCharacters("https://swapi.py4e.com/api/people/"); // Call the function on component mount
  }, [])

  return (
    <div className="App">
      <input type='text' id='busca' value={search} onChange={handleSearch} placeholder='Pesquise aqui' autoFocus />

      {selec.length ? (
        <div className='results-gallery'>
          {selec.map((personagem, index) => (
            <div key={`results-${index}`}>
              <p>{personagem}</p>
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
