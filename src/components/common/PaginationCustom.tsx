import usePagination from '@/hooks/usePagination';
import Pagination from '@mui/material/Pagination';
import { useState } from 'react';

// Define props for the PaginationCustom component
interface PaginationCustomProps<T> {
    items: T[];
    pageSize: number;
    totalRecords: number;
    setPageIndex(pageIndex: number): void;
}

const PaginationCustom = function <T>({ items, pageSize, totalRecords, setPageIndex }: PaginationCustomProps<T>) {
    const [page, setPage] = useState(1);

    const count = Math.ceil(totalRecords / pageSize);

    const pagination = usePagination(items, pageSize);

    const handleChangePage = function (newPage: number) {
        setPage(newPage);
        pagination.jump(newPage);
        setPageIndex(newPage);
    };

    return (
        <Pagination
            count={count}
            page={page}
            onChange={(_, newPage) => handleChangePage(newPage)}
             
            color="primary"
            showFirstButton showLastButton
        />
    );
};

export default PaginationCustom;
