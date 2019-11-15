import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaPlus, FaSpinner } from 'react-icons/fa';

import api from '../../services/api';

import Container from '../../components/Container';

import { Form, SubmitButton, List } from './styles';

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: 0,
    error: 0,
  };

  // Carrega dados do localStorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories:  JSON.parse(repositories) });
    }
  }

  // Salva dados no localStorage
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value, error: 0 });
  }

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({
      loading: 1,
      error: 0,
    });

    try {
      const { newRepo, repositories } = this.state;

      if (newRepo === '') throw new Error('Você precisa indicar um repositório!');

      const hasRepo = repositories.find(r => r.name === newRepo);
      if (hasRepo) throw new Error('Repositório duplicado!');

      const response = await api.get(`/repos/${newRepo}`);

      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
      });
    } catch (error) {
      this.setState({ error: 1 });
    } finally {
      this.setState({ loading: 0 })
    }
  }

  render() {
    const { newRepo, repositories, loading, error } = this.state;

    return (
      <Container>
        <h1>
          <FaGithub />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit} error={error}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton type="submit" loading={loading}>
            { loading ? <FaSpinner color="#fff" size={14} /> : <FaPlus color="#fff" size={14} /> }
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>Details</Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
