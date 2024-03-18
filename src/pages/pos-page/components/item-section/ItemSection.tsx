import { Fragment } from 'react'
import ItemSectionHeader from './components/item-section-header/ItemSectionHeader'
import Category from './components/category/Category'
import ItemContent from './components/item-section-content/ItemContent'
import ItemSectionFooter from './components/item-section-footer/ItemSectionFooter'

const ItemSection = () => {
    return (
        <Fragment>
            <ItemSectionHeader />
            <Category />
            <ItemContent />
            <ItemSectionFooter />
        </Fragment>
    )
}

export default ItemSection