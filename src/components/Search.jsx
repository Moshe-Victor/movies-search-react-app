import {useCallback} from 'react'

const Search = ({ searchTerm, setSearchTerm }) => {

    const handleSetSearchTerm = useCallback((evt) => {
        setSearchTerm(evt.target.value);
    }, [setSearchTerm])

  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search" />

        <input
          type="text"
          placeholder="Search through thousands of movies"
          value={searchTerm}
          onChange={handleSetSearchTerm}
        />
      </div>
    </div>
  )
}
export default Search
