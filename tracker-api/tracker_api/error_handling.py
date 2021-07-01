# http error handling


def register_error_handlers(app):

    # make 404 json response format format consistent with rest of app
    @app.errorhandler(404)
    def not_found(error):
        return {
            "status": "error",
            "data": None,
            "message": error.description,
        }, 404
