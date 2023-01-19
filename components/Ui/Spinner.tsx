function Spinner() {
    return (
        <div
            className="spinner__container"
        >
            <svg className="spinner" viewBox="0 0 66 66">
                <circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
            </svg>
        </div>
    )
}

export default Spinner