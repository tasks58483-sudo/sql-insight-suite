def format_record(record):
    """Converts a database record to a dictionary with camelCase keys."""
    if record is None:
        return None

    def to_camel_case(snake_str):
        components = snake_str.split('_')
        return components[0] + ''.join(x.title() for x in components[1:])

    return {to_camel_case(key): value for key, value in record.items()}

def format_records(records):
    """Converts a list of database records to a list of dictionaries with camelCase keys."""
    return [format_record(record) for record in records]
