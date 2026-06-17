# Project Brief

## Title

An Intelligent Dashboard for Object-Oriented Design Quality Analysis and AI-Powered Suggestions

## Problem

Early academic and small software projects often violate object-oriented design principles. Common issues include high coupling, low cohesion, large classes, and complex method structures. These problems make the system hard to maintain and difficult to extend.

## Proposed solution

The dashboard evaluates each Java class using object-oriented metrics and converts the result into a design score, grade, and refactoring recommendation.

## Metrics

| Metric | Purpose |
|---|---|
| WMC | Measures class complexity |
| RFC | Measures response surface and testing complexity |
| CBO | Measures coupling between classes |
| LCOM | Measures lack of cohesion |
| DIT | Measures inheritance depth |

## Current implementation

This frontend prototype supports Java file uploads in the browser and performs a simplified metric analysis suitable for demo and portfolio presentation.

## Production upgrade path

Use a backend analysis service with JavaParser or CKJM-compatible extraction for more accurate metrics.
