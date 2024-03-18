import { useEffect } from 'react'
import { TextField } from '@mui/material'
import moment from 'moment';
import { formatDateMoment } from '@/utils/format-date-moment';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let DateRangePicker: any;

type CustomDateRangeProps = {
    onChangeDateRange<T extends { from: string, to: string }>(data: T): void
}
const CustomDateRange = ({ onChangeDateRange }: CustomDateRangeProps) => {
    useEffect(() => {
        const valorInput = document.getElementById("custom-date-range");
        (function (DateRangePicker) {
            new DateRangePicker(valorInput,
                {
                    //startDate: '2000-01-01',
                    //endDate: '2000-01-03',
                    //minDate: '2021-07-15 15:00',
                    //maxDate: '2021-08-16 15:00',
                    //maxSpan: { "days": 9 },
                    //showDropdowns: true,
                    //minYear: 2020,
                    //maxYear: 2022,
                    //showWeekNumbers: true,
                    //showISOWeekNumbers: true,
                    timePicker: false,
                    //timePickerIncrement: 10,
                    //timePicker24Hour: true,
                    //timePickerSeconds: true,
                    //showCustomRangeLabel: false,
                    alwaysShowCalendars: true,
                    //opens: 'center',
                    //drops: 'up',
                    //singleDatePicker: true,
                    //autoApply: true,
                    //linkedCalendars: false,
                    //isInvalidDate: function(m){
                    //    return m.weekday() == 3;
                    //},
                    //isCustomDate: function(m){
                    //    return "weekday-" + m.weekday();
                    //},
                    //autoUpdateInput: false,
                    ranges: {
                        'Hoy': [moment(), moment()],
                        'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                        'Últimos 5 días': [moment().subtract(4, 'days'), moment()],
                        'Últimos 10 días': [moment().subtract(9, 'days'), moment()],
                        'Ultimos 15 Días': [moment().subtract(14, 'days'), moment()],
                        'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
                        'Este Mes': [moment().startOf('month'), moment().endOf('month')],
                        'El mes pasado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                    },
                    locale: {
                        applyLabel: "Aplicar",
                        cancelLabel: 'Cancelar',
                        customRangeLabel: 'Rango Personalizado',
                        separator: ' - ',
                        format: "YYYY-MM-DD"
                    }
                },
                function (start: Date, end: Date) {
                    const dateRange = {
                        from: formatDateMoment(new Date(start)),
                        to: formatDateMoment(new Date(end)),
                    }
                    if (typeof onChangeDateRange === 'function') {
                        onChangeDateRange(dateRange)
                    }
                })
            window.addEventListener('apply.daterangepicker', function () {

            });
        })(DateRangePicker);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <TextField
            label="Rango Fecha"
            id="custom-date-range"
            defaultValue="Small"
            size="small"
            fullWidth
        />
    )
}

export default CustomDateRange