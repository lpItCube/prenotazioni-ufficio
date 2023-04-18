import { useEffect, useState } from "react"

// Axios
import axios, { AxiosResponse } from "axios"

// Next
import { useSession } from "next-auth/react"

// Utils
import { getStringDate, getStringHours } from '../../utils/datePharser'

// Hooks
import { useAuthHook } from "../../hooks/useAuthHook";

// Components 
import Spinner from "../../components/Ui/Spinner"
import { Table, TableHeader, TableBody, TableRow, TableCol } from "../../components/Ui/Table"
import Button from "../../components/Ui/Button"
import ReservesFilters from "../../components/Reserves/ReservesFilters"

// Icons
import { RiDeleteBin3Line } from "react-icons/ri"
import { IoEllipsisHorizontalOutline } from 'react-icons/io5'

// Types
import { HitModalButton, OptionItem, Reserve } from "../../types";

// Costants
import { USER } from "../../_shared";

const Prenotazioni: React.FC = (): JSX.Element => {

	const session = useSession()
	const { userData } = useAuthHook()
	const userRole = userData.role
	const userId = userData.id

	const [allReserves, setAllReserves] = useState<Reserve[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [handleDelete, setHandleDelete] = useState<boolean>(false)
	const [filterMode, setFilterMode] = useState<OptionItem>({ label: 'Le mie prenotazioni', value: 'myUser' })
	const [filterRoom, setFilterRoom] = useState<OptionItem>({ label: 'Tutte le stanze', value: '' })
	const [filterDay, setFilterDay] = useState<OptionItem>({ label: 'Tutte le date', value: '' })
	const [showFilters, setShowFilters] = useState<boolean>(false)
	const [hitDeleteButton, setHitDeleteButton] = useState<HitModalButton>({ loading: false, id: null })


	useEffect(() => {
		setIsLoading(true)
	}, [])

	useEffect(() => {
		const getReserves = async (method: string) => {
			const response: AxiosResponse<Reserve[]> = await axios.get(`/api/reserve/currentUser?currentUser=${userId}&method=${method}`)
			let sortedResponse: Reserve[]

			sortedResponse = response.data

			if (filterDay.value !== '') {
				sortedResponse = sortedResponse.filter((res: Reserve) => new Date(res.from).toDateString() === filterDay.value)
			}

			const reorderData = sortedResponse.sort((a: any, b: any) => (a.to > b.to) ? 1 : -1)

			setAllReserves(reorderData)
			setIsLoading(false)
			setHitDeleteButton({ loading: false, id: null })
		}

		if (userId) {
			if (!hitDeleteButton.loading) {
				setIsLoading(true)
			}
			getReserves(filterMode.value)

		}

		if (handleDelete) {
			setHandleDelete(false)
		}
	}, [session, handleDelete, filterMode, filterRoom, filterDay, userId, hitDeleteButton.loading])


	const handleDeleteRow = async (reserveData: Reserve) => {
		setHitDeleteButton({ loading: true, id: reserveData.id })
		await axios.delete("/api/reserve/" + reserveData.id);
	}

	const handleShowFilters = () => {
		setShowFilters(prev => !prev)
	}

	let tableContent: JSX.Element


	if (allReserves.length > 0) {
		tableContent = (
			<>
				{allReserves.map((r: Reserve, index: number) => {
					return (
						<TableRow
							key={index}
							className={r.status === 'accepted' ? ' reserve--accepted' : ' reserve--pending'}
						>
							<TableCol
								className=''
							>
								<p>{getStringDate(r.from).day} {getStringDate(r.from).month} {getStringDate(r.from).year}</p>
							</TableCol>
							{r.from && r.to &&
								<TableCol
									className=""
								>
									<p>{getStringHours(r.from) as string} - {getStringHours(r.to) as string}</p>
								</TableCol>
							}
							<TableCol
								className=""
							>
								{r?.seat?.name}
							</TableCol>
							<TableCol
								className=""
							>
								{r.user.username}
							</TableCol>
							<TableCol
								className=""
							>
								{r.status === 'accepted' ? 'Accettato' : 'In attesa'}
							</TableCol>
							<TableCol
								className="prenotazioni__cta"
							>
								{(userRole !== USER || userRole === USER && r.user.id === userId) &&
									<>
										{hitDeleteButton.loading && hitDeleteButton.id === r.id
											? <Spinner />
											: <div className='approve__row--cta'>
												<Button
													className="cta cta--primary-delete cta__icon"
													onClick={() => handleDeleteRow(r)}
													type='button'
													icon={<RiDeleteBin3Line size={18} />}
													text=''
												/>
											</div>
										}
									</>
								}
							</TableCol>
						</TableRow>
					)
				})}
			</>
		)
	} else if (isLoading) {
		tableContent = <>
			<TableRow
				key={'not-found'}
				className=''
			>
				<TableCol
					className="prenotazioni__empty"
				>
					<Spinner />
				</TableCol>
			</TableRow>
		</>
	} else {
		tableContent = <>
			<TableRow
				key={'not-found'}
				className=''
			>
				<TableCol
					className="prenotazioni__empty"
				>
					<p>Nessuna prenotazione presente nella ricerca:</p>
					<p className="semiBold">{filterMode.label} {filterRoom.label} {filterDay.label}</p>
				</TableCol>
			</TableRow>
		</>
	}


	return (
		<div
			className="prenotazioni__container"
		>
			<ReservesFilters
				filterMode={filterMode}
				setFilterMode={setFilterMode}
				filterDay={filterDay}
				setFilterDay={setFilterDay}
				showFilters={showFilters}
			/>

			<div className="prenotazioni__wrapper">
				<div className="prenotazioni__header">

					<h2
						className="table__title txt-h3"
					>
						Prenotazioni
					</h2>
					<Button
						type='button'
						onClick={() => handleShowFilters()}
						className='cta cta--border-primary cta__icon cta__icon--reverse prenotazioni__filters-cta'
						text='Filtri'
						icon={<IoEllipsisHorizontalOutline size={18} />}

					/>
				</div>
				<Table>
					<TableHeader
						headerColumns={['Data', 'Orario', 'Postazione', 'Utente', 'Stato', '']}
					/>
					<TableBody>
						{isLoading && !hitDeleteButton
							? <TableRow
								key={'spinner'}
								className=''
							>
								<TableCol
									className="prenotazioni__spinner"
								><Spinner />
								</TableCol>
							</TableRow>
							: tableContent
						}
					</TableBody>
				</Table>
			</div>
		</div>
	)

}

export default Prenotazioni