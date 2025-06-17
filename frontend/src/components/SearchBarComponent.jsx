const SearchBarComponent = ({ submit, placeHolder, btnTitle, inputChange }) => {
  return (
    <form className="mx-3 mt-3" onSubmit={submit}>
      <div className="input-group">
        <button className="btn btn-primary" type="submit">
          {btnTitle}
        </button>
        <input
          type="text"
          placeholder={placeHolder}
          className="form-control"
          onChange={inputChange}
        />
      </div>
    </form>
  );
};

export default SearchBarComponent;
