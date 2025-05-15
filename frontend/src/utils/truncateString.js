const truncateString = (str, strLength) => {
    return str.length > strLength ? str.slice(0, strLength) + "..." : str;
};

export { truncateString };
