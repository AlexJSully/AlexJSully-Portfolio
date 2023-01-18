import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import Home from "./home";

test("renders learn react link", async () => {
	await act(async () => render(<Home key="Home-section" />));
	// Find if ID "profilePic" exists
	const profilePic = screen.getByTestId("profilePic");
	expect(profilePic).toBeInTheDocument();
});
