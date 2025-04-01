import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import FilteredAlerts from '../src/components/FilteredAlerts';



describe('FilteredAlerts Component', () => {
    const mockSetState = jest.fn();
    const mockData = { key1: ['value1'], key2: ['value2', 'value 3'] };


    it('renders without crashing', () => {
        render(
            <FilteredAlerts
                data={mockData}
                value={false}
                state="key1"
                setState={mockSetState}
            />
        );
        expect(screen.getAllByRole('option')).toHaveLength(2);
    });

    it('renders options based on props.data keys when props.value is false', () => {
        render(
            <FilteredAlerts
                data={mockData}
                value={false}
                state=""
                setState={mockSetState}
            />
        );

        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(2);
        expect(options[0]).toHaveTextContent('key1');
        expect(options[1]).toHaveTextContent('key2');
    });

    it('renders options based on props.data values when props.value is true', () => {

        render(
            <FilteredAlerts
                data={mockData}
                value={true}
                state=""
                setState={mockSetState}
            />
        );

        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(2);
        expect(options[0]).toHaveTextContent('value1');
        expect(options[1]).toHaveTextContent('value2');
    });

    it('renders no options when props.data is empty', () => {
        render(
            <FilteredAlerts
                data={{}}
                value={false}
                state=""
                setState={mockSetState}
            />
        );

        const options = screen.queryAllByRole('option');
        expect(options).toHaveLength(0);
    });

    it('renders no options when props.data is undefined', () => {
        render(
            <FilteredAlerts
                data={undefined}
                value={false}
                state=""
                setState={mockSetState}
            />
        );

        const options = screen.queryAllByRole('option');
        expect(options).toHaveLength(0);
    });



    it('calls setState with the correct value on change', () => {

        render(
            <FilteredAlerts
                data={mockData}
                value={false}
                state=""
                setState={mockSetState}
            />
        );

        const selectElement = screen.getAllByRole('combobox')[0];
        fireEvent.change(selectElement, { target: { value: 'key1' } });

        expect(mockSetState).toHaveBeenCalledWith(expect.anything());
    });

    it('applies the className prop to the select element', () => {
        render(
            <FilteredAlerts
                data={mockData}
                value={false}
                className="custom-class"
                state=""
                setState={mockSetState}
            />
        );

        const selectElement = screen.getAllByRole('combobox')[0];

        expect(selectElement).toHaveClass('custom-class');
    });

    it('handles null props.data gracefully', () => {
        render(
            <FilteredAlerts
                data={null}
                value={false}
                state=""
                setState={mockSetState}
            />
        );

        const options = screen.queryAllByRole('option');
        expect(options).toHaveLength(0);
    });

    it('handles undefined props.state gracefully', () => {
        render(
            <FilteredAlerts
                data={{ key1: 'value1', key2: 'value2' }}
                value={false}
                state={undefined}
                setState={mockSetState}
            />
        );

        const selectElement = screen.getAllByRole('option');
        expect(selectElement).toHaveLength(2);
    });
});

describe('FilteredAlerts Component', () => {
    const mockSetState = jest.fn();
    const mockData = { key1: ['value1'], key2: ['value2', 'value 3'] };

    it('renders options based on props.data keys when props.value is false', () => {

        render(
            <FilteredAlerts
                data={mockData}
                value={false}
                state=""
                setState={mockSetState}
            />
        );

        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(2);
        expect(options[0]).toHaveTextContent('key1');
        expect(options[1]).toHaveTextContent('key2');
    });

    it('renders options based on props.data values when props.value is true', () => {

        render(
            <FilteredAlerts
                data={mockData}
                value={true}
                state=""
                setState={mockSetState}
            />
        );

        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(2);
        expect(options[0]).toHaveTextContent('value1');
        expect(options[1]).toHaveTextContent('value2');
    });


    it('calls setState with the correct value on change', () => {

        render(
            <FilteredAlerts
                data={mockData}
                value={false}
                state=""
                setState={mockSetState}
            />
        );

        const selectElement = screen.getByRole('combobox');
        fireEvent.change(selectElement, { target: { value: 'key1' } });

        expect(mockSetState).toHaveBeenCalledWith('key1');
    });


});