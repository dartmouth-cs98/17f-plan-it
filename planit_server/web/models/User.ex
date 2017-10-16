defmodule PlanIt.User do
  use PlanIt.Web, :model

  schema "users" do
    field :fname, :string
    field :lname, :string
    field :email, :string
    field :username, :string
    field :birthday, :integer

    timestamps
  end
end
