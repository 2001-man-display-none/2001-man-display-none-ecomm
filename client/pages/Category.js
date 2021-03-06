import React from 'react'
import {connect} from 'react-redux'
import {selectCategory, fetchSingleCategory} from '../store/categories'
import ProductTile from '../components/ProductTile'

export class CategoryPage extends React.Component {
  componentDidMount() {
    this.loadFromSlug(this.props.slug)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.slug !== this.props.slug) {
      this.loadFromSlug(this.props.slug)
    }
  }

  loadFromSlug(slug) {
    this.props.selectCategory(slug)
    this.props.fetchCategoryProducts(slug)
  }

  async handlePageChange(pageNum) {
    await this.props.fetchProducts(pageNum.selected)
  }

  render() {
    const {category, products, status} = this.props
    switch (status) {
      case 'loading':
        return <div>loading...</div>
      case 'error':
        return <div>Couldn't load products. Try again later.</div>
      case 'done':
        return (
          <div className="page category-page">
            <h1>{category.name}</h1>
            <div className="product-list">
              {products.map(product => (
                <ProductTile key={product.id} product={product} />
              ))}
            </div>
          </div>
        )
      default:
        console.error('unknown products status')
    }
  }
}

const stateProps = (state, ownProps) => {
  return {
    slug: ownProps.match.params.slug,
    status: state.categories.currentCategory.status,
    category: state.categories.currentCategory.value,
    products: state.categories.currentCategory.value.products
  }
}

const dispatchProps = dispatch => ({
  fetchCategoryProducts: category => dispatch(fetchSingleCategory(category)),
  selectCategory: category => dispatch(selectCategory(category))
})

const ConnectedCategoryPage = connect(stateProps, dispatchProps)(CategoryPage)

export default ConnectedCategoryPage
