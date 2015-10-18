function Exists(i) {
  return (i !== undefined && i !== null);
}

// base = [[a][b][c]], addition = [[q],[r],[t]]
// result = [[a,q][b,r][c,t]]
// base = [[a][b], addition = [[q],[r],[t]]
// result = [[a,q][b,r][t]]
function Horizontal2DMerge(base,addition) {
  for (var i = 0; i < addition.length; i++) {
    if(!Exists(base[i])){
      base.push([]);
    }else if( !$.isArray(base[i])){
      base[i] = [base[i]];
    }
    base[i].push(addition[i]);
  }
}
