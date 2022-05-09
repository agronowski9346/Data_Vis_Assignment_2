import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as d3 from "d3";

function App() {
  useEffect(() => {
    let makeGraph = async () => {
      /*
      let test = await d3.json(
        "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json"
      );
      let nodes = test.nodes;
      let links = test.links;

      console.log(test);
      */

      let links = await d3.csv(
        "https://raw.githubusercontent.com/melaniewalsh/sample-social-network-datasets/master/sample-datasets/political-books/political-books-edges.csv"
      );

      let nodes = await d3.csv(
        "https://raw.githubusercontent.com/melaniewalsh/sample-social-network-datasets/master/sample-datasets/political-books/political-books-nodes.csv"
      );

      let reMap = async () => {
        links = links.map((link, i) => {
          return {
            source: parseInt(link.Source),
            target: parseInt(link.Target),
            index: i,
          };
        });

        nodes = nodes.map((node, i) => {
          return {
            id: parseInt(node.Id),
            Label: node.Label,
            political_ideology: node.political_ideology,
            index: i,
          };
        });
      };

      await reMap();

      console.log(nodes);
      console.log(links);

      let height = 800;
      let width = 1000;

      let svg = d3
        .select("div")
        .append("svg")
        .attr("height", height)
        .attr("width", width);

      let link = svg
        .append("g")
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("stroke-width", 1)
        .style("stroke", "pink");

      let p = d3.select("div").append("p").attr("id", "tooltip");

      let onMouseOver = (event, d, i) => {
        console.log(d);
        d3.select("#tooltip")
          .classed("show", true)
          .style("top", event.clientY + 5 + "px")
          .style("left", event.clientX + 5 + "px")
          .html("Book: " + d.Label)
          .style("background-color", () => {
            if (d.political_ideology === "liberal") return "blue";
            else if (d.political_ideology === "conservative") return "red";
            else return "grey";
          });
        d3.select("#tooltip").classed("hide", false);
      };

      let onMouseOut = (e) => {
        d3.select("#tooltip").classed("show", false);
        d3.select("#tooltip").classed("hide", true);
      };

      let node = svg
        .append("g")
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("fill", (d) => {
          if (d.political_ideology === "liberal") return "blue";
          else if (d.political_ideology === "conservative") return "red";
          else return "grey";
        })
        .on("mouseover", (event, d, i) => {
          onMouseOver(event, d, i);
        })
        .on("mouseout", (event) => {
          onMouseOut(event);
        });

      let ticked = () => {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      };

      let simulation = d3
        .forceSimulation(nodes)
        .force("link", d3.forceLink().links(links))
        .force("charge", d3.forceManyBody().strength(-40))
        .force("center", d3.forceCenter(width / 2, height / 2));
      simulation.nodes(nodes).on("tick", ticked);

      svg.attr("transform", "rotate(90 0 0)");

      let legend = d3
        .select("div")
        .append("svg")
        .attr("height", 200)
        .attr("width", 200);
    };

    makeGraph();
  }, []);
  return <div></div>;
}

export default App;
