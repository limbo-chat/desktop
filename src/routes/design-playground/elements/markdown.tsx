import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "../../../features/markdown/components/code-block";
import { Markdown } from "../../../features/markdown/components/markdown";

export const Route = createFileRoute("/design-playground/elements/markdown")({
	component: MarkdownElementComponent,
});

function MarkdownElementComponent() {
	return (
		<Markdown>
			<h1>Markdown</h1>
			<h2>Headings</h2>
			<h1>H1</h1>
			<h2>H2</h2>
			<h3>H3</h3>
			<h4>H4</h4>
			<h5>H5</h5>
			<h6>H6</h6>
			<hr />
			<h2>Text Styling</h2>
			<p>
				<strong>Bold</strong>
				<br />
				<em>Italic</em>
				<br />
				<strong>
					<em>Bold and Italic</em>
				</strong>
				<br />
				<del>Strikethrough</del>
			</p>
			<hr />
			<h2>Blockquote</h2>
			<blockquote>
				<p>This is a blockquote.</p>
				<blockquote>
					<p>Nested blockquote.</p>
				</blockquote>
			</blockquote>
			<hr />
			<h2>Lists</h2>
			<h3>Unordered List</h3>
			<ul>
				<li>
					Item 1
					<ul>
						<li>
							Subitem 1
							<ul>
								<li>Subsubitem</li>
							</ul>
						</li>
					</ul>
				</li>
				<li>Item 2</li>
			</ul>
			<h3>Ordered List</h3>
			<ol>
				<li>First</li>
				<li>
					Second
					<ol>
						<li>Subsecond</li>
						<li>Subthird</li>
					</ol>
				</li>
				<li>Third</li>
			</ol>
			<hr />
			<h2>Code</h2>
			<h3>Inline Code</h3>
			<p>
				Here is some <code>inline code</code>.
			</p>
			<h3>Code Block</h3>
			<CodeBlock lang="typescript" content="console.log('hello world')" />
			<hr />
			<h2>Todo list</h2>
			<ul>
				<li>
					<input type="checkbox" checked /> Task 1
				</li>
				<li>
					<input type="checkbox" /> Task 2
				</li>
			</ul>
			<hr />
			<h2>Tables</h2>
			<table>
				<thead>
					<tr>
						<th>Item</th>
						<th>Quantity</th>
						<th>Price</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Apples</td>
						<td>10</td>
						<td>$1.00</td>
					</tr>
					<tr>
						<td>Bananas</td>
						<td>5</td>
						<td>$0.50</td>
					</tr>
					<tr>
						<td>Cherries</td>
						<td>20</td>
						<td>$2.00</td>
					</tr>
				</tbody>
				<tfoot>
					<tr>
						<td>Total</td>
						<td>35</td>
						<td>$3.50</td>
					</tr>
				</tfoot>
			</table>
			<hr />
			<h2>Cute pictures</h2>
			<img
				alt="Doggy style"
				src="https://images.unsplash.com/photo-1546238232-20216dec9f72"
			/>
			<br />
			<img
				alt="Cute ass otter"
				src="https://ultimatekilimanjaro.com/wp-content/uploads/2024/01/cuteanimal01.jpg"
			/>
		</Markdown>
	);
}
