import ErrorBoundary from '@/components/common/ErrorBoundary';
import PaginationCustom from '@/components/common/PaginationCustom';
import { useOrderStore } from '@/store/order/order.slice';
import { isValidField } from '@/utils/utils';
import { Card, CardContent, Grid } from '@mui/material';
import { useEffect } from 'react';

import OrderContentFilter from './components/OrderContentFilter';
import OrderList from './components/OrderList';

const Order = () => {

  const { orders, dataFilter, setChangeFieldFilter, getDataFilter, getOrders } = useOrderStore(state => state);
 
  useEffect(() => {
    getDataFilter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (isValidField(dataFilter.codEstab) && dataFilter.idPuntoEmision > 0) {
      getOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFilter]); 

  const setPageIndex = (pageIndex: number) => {
    setChangeFieldFilter("pageIndex", pageIndex);
  }
 
  return (
    <>
      <ErrorBoundary fallBackComponent={<>Error</>}>
        <Card>
          <CardContent>
            <Grid container>
              <OrderContentFilter />
              <OrderList />

              <Grid mt={3}>
                <PaginationCustom
                  items={orders}
                  totalRecords={orders.length > 0 ? orders[0].totalRecords : 0}
                  pageSize={dataFilter.pageSize}
                  setPageIndex={setPageIndex}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </ErrorBoundary>
    </>
  )
}

export default Order