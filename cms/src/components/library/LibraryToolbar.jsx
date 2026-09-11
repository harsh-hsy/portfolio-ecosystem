import { FiPlus, FiSearch } from 'react-icons/fi'

const libraryFilters = ['All', 'Published', 'Draft', 'Featured', 'Hidden']

function LibraryToolbar({ resourceName, activeFilter, query, onFilter, onQuery, onCreate }) {
  const pluralName = `${resourceName}s`

  return (
    <div className="projects-overview__toolbar" aria-label={`${resourceName} library controls`}>
      <div className="projects-overview__filters" role="group" aria-label={`Filter ${pluralName}`}>
        {libraryFilters.map((filter) => (
          <button
            className={activeFilter === filter ? 'is-active' : ''}
            key={filter}
            type="button"
            onClick={() => onFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="projects-overview__toolbar-actions">
        <label className="projects-overview__search">
          <FiSearch aria-hidden="true" />
          <span className="sr-only">Search {pluralName}</span>
          <input
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder={`Search ${pluralName}`}
          />
        </label>
        <button className="btn btn-primary" type="button" onClick={onCreate}>
          <FiPlus aria-hidden="true" /> Add {resourceName}
        </button>
      </div>
    </div>
  )
}

export default LibraryToolbar
