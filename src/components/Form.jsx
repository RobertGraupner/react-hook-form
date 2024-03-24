import './Form.css';
import { useForm } from 'react-hook-form';

export function Form({ onAddPerson }) {
	// register - funkcja która zwraca obiekt z właściwościami do obsługi formularza
	// getValues - funkcja która zwraca obiekt z wartościami formularza
	// handleSubmit - funkcja która zwraca funkcję, która przyjmuje jeden argument - funkcję obsługującą dane z formularza
	// formState - obiekt zawierający informacje, które możemy wyciągnąć
	// watch - funkcja która obserwuje stan checkboxa w naszym wypadku, watch powodje rerender komponentu więc trzeba z nim uważać
	// reset - funkcja resetująca formularz. Błędy i stan formularza są resetowane
	const {
		register,
		getValues,
		handleSubmit,
		formState: { errors, isDirty, isSubmitSuccessful },
		watch,
		reset,
		setError,
	} = useForm({
		// mode - opcjonalna wartość, która może przyjmować wartości 'onChange', 'onBlur', 'onSubmit' lub 'all'
		// onChange - wartość jest zapisywana w momencie zmian wartości w polu
		// onBlur - wartość jest zapisywana w momencie opuszczania pola
		// all - wartość jest zapisywana w momencie zmian wartości w polu i opuszczania pola
		// domyślnie jest onSubmit
		mode: 'onBlur',
	});
	// w useForm można dodać defaultValues i ustawić startowe wartości

	// const nameField = register('name', { required: true });
	// const ageField = register('age', { required: true });
	// const telField = register('tel', { required: true });
	// const emailField = register('email', { required: true });
	// const isInvoiceRequiredField = register('isInvoiceRequired');
	// const nipField = register('nip');

	// możemy to zapisać krócej jako np. {...register('name', { required: true })}
	// jako drugi argument możemy podać obiekt z opisanymi regułami walidacji

	function onSubmit(data) {
		const { isInvoiceRequired, ...formData } = data;
		if (!isInvoiceRequired) {
			delete formData.nip;
		}
		try {
			onAddPerson(formData);
		} catch (error) {
			setError('general', { message: 'Błąd z backendu' });
		}
	}

	const isInvoiceRequired = watch('isInvoiceRequired');

	// isSubmitSuccessful - informacja, czy formularz został prawidłowo wysłany
	if (isSubmitSuccessful) {
		return (
			<>
				<span className='title'>Osoba dodana!</span>
				<button onClick={() => reset()}>Dodaj kolejną osobę</button>
			</>
		);
	}
	return (
		// noValidate - wyłącza walidację przeglądarki
		<form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete='off'>
			<label htmlFor='name'>Imię</label>
			<input
				id='name'
				{...register('name', {
					required: { value: true, message: 'Podaj imię' },
				})}
			/>
			{errors.name && <span className='error'>{errors.name.message}</span>}

			<label htmlFor='age'>Wiek</label>
			<input
				id='age'
				type='number'
				{...register('age', {
					// możemy podać obiekt z opisanymi regułami walidacji i wiadomością do wyświetlenia w przypadku błędu
					required: { value: true, message: 'Podaj wiek' },
					valueAsNumber: true,
					min: { value: 0, message: 'Wiek nie może być mniejszy niż 0' },
					max: { value: 100, message: 'Wiek nie może być większy niż 100' },
				})}
			/>
			{errors.age && <span className='error'>{errors.age.message}</span>}

			<label htmlFor='tel'>Telefon</label>
			<input
				id='tel'
				type='tel'
				{...register('contact.tel', {
					required: {
						value: true,
						message: 'Podaj numer telefonu',
					},
					pattern: {
						value: /^[+][0-9]{9,15}$/,
						message: 'Podaj poprawny numer telefonu',
					},
				})}
			/>
			{errors.contact?.tel && (
				<span className='error'>{errors.contact.tel.message}</span>
			)}

			<label htmlFor='email'>E-mail</label>
			<input
				id='email'
				type='email'
				{...register('contact.email', {
					required: { value: true, message: 'Podaj email' },
					validate: (email) =>
						email.includes('@') || 'Podaj poprawny adres e-mail',
				})}
			/>
			{errors.contact?.email && (
				<span className='error'>{errors.contact.email.message}</span>
			)}

			<label htmlFor='isInvoiceRequired'>
				<input
					id='isInvoiceRequired'
					type='checkbox'
					placeholder='Podaj NIP'
					{...register('isInvoiceRequired')}
				/>
				Faktura VAT
			</label>
			<input
				id='nip'
				type='number'
				{...register('nip', {
					required: {
						value: isInvoiceRequired,
						message: 'Podaj NIP',
					},
					disabled: !isInvoiceRequired,
					pattern: {
						value: /^[0-9]{10}$/,
						message: 'Podaj poprawny NIP',
					},
				})}
			/>
			{errors.nip && <span className='error'>{errors.nip.message}</span>}

			<div className='footer'>
				{errors.general && (
					<span className='error'>{errors.general.message}</span>
				)}
				<button disabled={!isDirty}>Dodaj</button>
			</div>
		</form>
	);
}
