import {FcSearch} from 'react-icons/fc'
import './index.css'

const FiltersGroup = props => {
  const {
    ratingsList,
    categoryOptions,
    CategoryFunCliked,
    RatingFunCliked,
    ClearFiltersButton,
    searchUpdated,
    titleSearch,
    searchTheEle,
  } = props

  console.log(titleSearch)

  const CategoryFunClikedCall = event => {
    CategoryFunCliked(event.target.value)
  }

  const ClearFiltersButtonCall = () => {
    ClearFiltersButton()
  }

  const searchUpdatedCall = event => {
    console.log(event.target.value)
    searchUpdated(event.target.value)
  }

  const searchTheEleCall = event => {
    searchTheEle(event.key)
  }

  return (
    <div className="filters-group-container">
      <div className="SearchCon">
        <input
          type="search"
          className="search"
          placeholder="Search"
          value={titleSearch}
          onChange={searchUpdatedCall}
          onKeyDown={searchTheEleCall}
        />
        <FcSearch className="img" />
      </div>
      <h1>Category</h1>
      <div className="CategoryCon">
        {categoryOptions.map(eachItem => (
          <button
            type="button"
            key={eachItem.categoryId}
            value={eachItem.categoryId}
            className="btn"
            onClick={CategoryFunClikedCall}
          >
            <p>{eachItem.name}</p>
          </button>
        ))}
      </div>

      <h1>Rating</h1>
      <ul className="RtingsCon">
        {ratingsList.map(eachItem => {
          const RatingFunClikedCall = () => {
            console.log(eachItem.ratingId)
            RatingFunCliked(eachItem.ratingId)
          }
          return (
            <li
              key={eachItem.ratingId}
              className="rowConInrating btn"
              onClick={RatingFunClikedCall}
            >
              <img
                src={`${eachItem.imageUrl}`}
                className="stars"
                alt={`rating ${eachItem.ratingId}`}
              />

              <p>& up</p>
            </li>
          )
        })}
      </ul>
      <button
        type="button"
        className="btn btn1"
        onClick={ClearFiltersButtonCall}
      >
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
