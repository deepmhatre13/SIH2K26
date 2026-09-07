"""
Unit tests for the `hello` function in app/main.py.

Covers:
- Happy path: Standard GET request to /api/hello returns expected response.
- Edge cases: Unusual HTTP methods, path case-sensitivity, and malformed requests.

All tests use pytest and are organized in a single class as per instructions.
"""

import pytest
from fastapi.testclient import TestClient

# Import the FastAPI app from the module under test
from app.main import app

@pytest.fixture(scope="class")
def client():
    """Fixture to provide a TestClient for the FastAPI app."""
    with TestClient(app) as c:
        yield c

class TestHello:
    @pytest.mark.happy_path
    def test_hello_returns_expected_message(self, client):
        """
        Happy path: Ensure GET /api/hello returns the correct JSON response and status code.
        """
        response = client.get("/api/hello")
        assert response.status_code == 200
        assert response.json() == {"message": "Hello from FastAPI"}

    @pytest.mark.happy_path
    def test_hello_response_content_type(self, client):
        """
        Happy path: Ensure the Content-Type header is application/json.
        """
        response = client.get("/api/hello")
        assert response.headers["content-type"].startswith("application/json")

    @pytest.mark.edge_case
    def test_hello_wrong_method_post(self, client):
        """
        Edge case: POST to /api/hello should return 405 Method Not Allowed.
        """
        response = client.post("/api/hello")
        assert response.status_code == 405

    @pytest.mark.edge_case
    def test_hello_wrong_method_put(self, client):
        """
        Edge case: PUT to /api/hello should return 405 Method Not Allowed.
        """
        response = client.put("/api/hello")
        assert response.status_code == 405

    @pytest.mark.edge_case
    def test_hello_wrong_method_delete(self, client):
        """
        Edge case: DELETE to /api/hello should return 405 Method Not Allowed.
        """
        response = client.delete("/api/hello")
        assert response.status_code == 405

    @pytest.mark.edge_case
    def test_hello_path_case_sensitivity(self, client):
        """
        Edge case: Path is case-sensitive; /api/Hello should return 404.
        """
        response = client.get("/api/Hello")
        assert response.status_code == 404

    @pytest.mark.edge_case
    def test_hello_trailing_slash(self, client):
        """
        Edge case: GET /api/hello/ (with trailing slash) should return 404.
        """
        response = client.get("/api/hello/")
        assert response.status_code == 404

    @pytest.mark.edge_case
    def test_hello_extra_path_segment(self, client):
        """
        Edge case: GET /api/hello/anything should return 404.
        """
        response = client.get("/api/hello/extra")
        assert response.status_code == 404

    @pytest.mark.edge_case
    def test_hello_accepts_query_params(self, client):
        """
        Edge case: GET /api/hello with query parameters should still return the correct response.
        """
        response = client.get("/api/hello?foo=bar")
        assert response.status_code == 200
        assert response.json() == {"message": "Hello from FastAPI"}