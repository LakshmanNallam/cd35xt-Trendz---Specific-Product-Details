import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const StateObj = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
  nothingcame: 'NOTHING',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    currentStatus: StateObj.initial,
    activeOptionId: sortbyOptions[0].optionId,
    categorySelected: '',
    ratingSelected: '',
    titleSearch: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  CategoryFunCliked = id => {
    this.setState({categorySelected: id}, this.getProducts)
  }

  ClearFiltersButton = () => {
    this.setState(
      {
        categorySelected: '',
        ratingSelected: '',
        titleSearch: '',
        productsList: '',
        currentStatus: StateObj.initial,
      },
      this.getProducts,
    )
  }

  RatingFunCliked = id => {
    console.log(id)
    this.setState({ratingSelected: id}, this.getProducts)
  }

  searchUpdated = value => {
    console.log(value, 'vachindhi')

    if (value === '') {
      this.setState({titleSearch: ''}, this.getProducts)
    } else {
      this.setState({titleSearch: value})
    }
  }

  searchTheEle = Key => {
    if (Key === 'Enter') {
      this.getProducts()
    }
  }

  getProducts = async () => {
    this.setState({
      currentStatus: StateObj.loading,
    })
    const jwtToken = Cookies.get('jwt_token')

    const {
      activeOptionId,
      categorySelected,
      ratingSelected,
      titleSearch,
    } = this.state

    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${categorySelected}&title_search=${titleSearch}&rating=${ratingSelected}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok) {
      const fetchedData = await response.json()
      if (fetchedData.products.length === 0) {
        this.setState({currentStatus: StateObj.nothingcame})
      } else {
        const updatedData = fetchedData.products.map(product => ({
          title: product.title,
          brand: product.brand,
          price: product.price,
          id: product.id,
          imageUrl: product.image_url,
          rating: product.rating,
        }))

        this.setState({
          productsList: updatedData,
          currentStatus: StateObj.success,
        })
      }
    } else if (response.ok === false) {
      this.setState({currentStatus: StateObj.failure})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId, currentStatus} = this.state

    switch (currentStatus) {
      case StateObj.initial:
        return null
      case StateObj.loading:
        return this.renderLoader()
      case StateObj.success:
        return (
          <div className="all-products-container">
            <ProductsHeader
              activeOptionId={activeOptionId}
              sortbyOptions={sortbyOptions}
              changeSortby={this.changeSortby}
            />
            <ul className="products-list">
              {productsList.map(product => (
                <ProductCard productData={product} key={product.id} />
              ))}
            </ul>
          </div>
        )
      case StateObj.nothingcame:
        return (
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
            alt="no products"
          />
        )
      default:
        return (
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
            alt="products failure"
          />
        )
    }
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view

  render() {
    const {titleSearch} = this.state
    return (
      <div className="all-products-section">
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          CategoryFunCliked={this.CategoryFunCliked}
          RatingFunCliked={this.RatingFunCliked}
          ClearFiltersButton={this.ClearFiltersButton}
          searchUpdated={this.searchUpdated}
          searchTheEle={this.searchTheEle}
          titleSearch={titleSearch}
        />
        {this.renderProductsList()}
      </div>
    )
  }
}

export default AllProductsSection
