// File: Landing.test.tsx
// Description: Tests app landing page
// First version: 2021/07/05

import { screen, render } from "@testing-library/react";
import Landing from "./Landing";

test("landing page renders", () => {
    render(<Landing/>);
    const title = screen.getByText('Time Tracker');
    expect(title).toBeInTheDocument();
});
