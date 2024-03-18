import { CompanyCustomerReadUpdate } from "@/models/company-customer.model";
import { companyCustomerSvc } from "@/services/external/company-customer.service";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
    id: number
}
export const CompanyCustomerInfo = ({ id }: Props) => {
    const [data, setData] = useState<CompanyCustomerReadUpdate>({} as CompanyCustomerReadUpdate);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    useEffect(() => {
        companyCustomerSvc.getId(id).then(response => {
            if (response) {
                setData(response)
            }
            setLoading(false)
        }).catch(() => setError(true))

    }, [])

    if (error) return <>Algo salio mal</>

    if (loading) {
        return (
            <Box sx={{ width: 200 }}>
                <Skeleton />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
            </Box>
        )
    }
    return (
        <>
            <Stack>
                <Typography variant="caption" gutterBottom>
                    <strong>Nombre Fiscal:</strong> {data.razonSocialComprador}
                </Typography>
                <Typography variant="caption" gutterBottom>
                    <strong>Nombre Comercial:</strong> {data.nombreComercial}
                </Typography>
                <Typography variant="caption" gutterBottom>
                    <strong>Correo:</strong> <br />
                    {
                        data.correo.split('|').map((item, index) => (
                            <span key={index}> {item}</span>
                        ))
                    }
                </Typography>
                <Typography variant="caption" gutterBottom>
                    <strong>Teléfono:</strong> {data.telefono}
                </Typography>
                <Typography variant="caption" gutterBottom>
                    <strong>Dirección:</strong> {data.direccion}
                </Typography>
            </Stack>
        </>
    )
}
